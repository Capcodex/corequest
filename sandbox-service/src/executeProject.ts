import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname, normalize } from "node:path";
import { spawn } from "node:child_process";
import { performance } from "node:perf_hooks";
import { forceKillProcess } from "./cleanup.ts";
import {
  SANDBOX_CPU_LIMIT,
  SANDBOX_MEMORY_LIMIT,
  SANDBOX_PIDS_LIMIT,
  SANDBOX_PROJECT_FILES_MAX_COUNT,
  SANDBOX_PROJECT_FILE_MAX_LENGTH,
  SANDBOX_PROJECT_TOTAL_BYTES_MAX,
  SANDBOX_PROJECT_TIMEOUT_MS,
  SANDBOX_RUNNER_IMAGE,
  SANDBOX_STDIN_MAX_LENGTH,
} from "./securityLimits.ts";
import type { SandboxExecutionResponse, SandboxProjectExecutionRequest } from "./types.ts";

const DOCKER_FAILURE_EXIT_CODE = 125;
const ALLOWED_PROJECT_COMMANDS = new Set(["cargo run --quiet", "cargo test --quiet"]);

export async function executeProject(payload: SandboxProjectExecutionRequest): Promise<SandboxExecutionResponse> {
  const stdin = payload.stdin ?? "";

  if (!ALLOWED_PROJECT_COMMANDS.has(payload.runCommand)) {
    return {
      status: "sandbox_error",
      stdout: "",
      stderr: "Commande projet non autorisée dans la sandbox.",
      durationMs: 0,
    };
  }

  if (payload.files.length === 0) {
    return {
      status: "sandbox_error",
      stdout: "",
      stderr: "Aucun fichier projet fourni.",
      durationMs: 0,
    };
  }

  if (payload.files.length > SANDBOX_PROJECT_FILES_MAX_COUNT) {
    return {
      status: "sandbox_error",
      stdout: "",
      stderr: "Le projet dépasse le nombre de fichiers autorisé.",
      durationMs: 0,
    };
  }

  if (stdin.length > SANDBOX_STDIN_MAX_LENGTH) {
    return {
      status: "sandbox_error",
      stdout: "",
      stderr: "L'entrée standard dépasse la taille autorisée pour le projet.",
      durationMs: 0,
    };
  }

  const totalBytes = payload.files.reduce((sum, file) => sum + Buffer.byteLength(file.content, "utf8"), 0);

  if (totalBytes > SANDBOX_PROJECT_TOTAL_BYTES_MAX) {
    return {
      status: "sandbox_error",
      stdout: "",
      stderr: "Le projet dépasse la taille totale autorisée.",
      durationMs: 0,
    };
  }

  for (const file of payload.files) {
    if (file.content.length > SANDBOX_PROJECT_FILE_MAX_LENGTH) {
      return {
        status: "sandbox_error",
        stdout: "",
        stderr: `Le fichier ${file.path} dépasse la taille autorisée.`,
        durationMs: 0,
      };
    }

    if (!isSafeRelativePath(file.path)) {
      return {
        status: "sandbox_error",
        stdout: "",
        stderr: `Chemin de fichier invalide: ${file.path}`,
        durationMs: 0,
      };
    }
  }

  const tempWorkspace = await mkdtemp(join(tmpdir(), "corequest-project-"));

  try {
    for (const file of payload.files) {
      const absolutePath = join(tempWorkspace, file.path);
      await mkdir(dirname(absolutePath), { recursive: true });
      await writeFile(absolutePath, file.content, "utf8");
    }

    const archiveBuffer = await createTarArchive(tempWorkspace);
    return await runProjectInSandbox(archiveBuffer, payload.runCommand, stdin);
  } finally {
    await rm(tempWorkspace, { recursive: true, force: true });
  }
}

async function createTarArchive(workspacePath: string): Promise<Buffer> {
  return await new Promise<Buffer>((resolve, reject) => {
    const child = spawn("tar", ["-cf", "-", "."], {
      cwd: workspacePath,
      stdio: ["ignore", "pipe", "pipe"],
    });

    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];

    child.stdout.on("data", (chunk: Buffer) => stdoutChunks.push(chunk));
    child.stderr.on("data", (chunk: Buffer) => stderrChunks.push(chunk));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(Buffer.concat(stderrChunks).toString("utf8") || "Impossible de préparer l'archive projet."));
        return;
      }

      resolve(Buffer.concat(stdoutChunks));
    });
  });
}

async function runProjectInSandbox(archiveBuffer: Buffer, runCommand: string, stdin: string): Promise<SandboxExecutionResponse> {
  const encodedStdin = Buffer.from(stdin, "utf8").toString("base64");
  const encodedCommand = Buffer.from(runCommand, "utf8").toString("base64");
  const startTime = performance.now();
  const dockerArgs = [
    "run",
    "--rm",
    "-i",
    "--network",
    "none",
    "--memory",
    SANDBOX_MEMORY_LIMIT,
    "--cpus",
    SANDBOX_CPU_LIMIT,
    "--pids-limit",
    SANDBOX_PIDS_LIMIT,
    "--security-opt",
    "no-new-privileges",
    "--cap-drop",
    "ALL",
    "--tmpfs",
    "/workspace:rw,exec,nosuid,size=128m",
    "--workdir",
    "/workspace",
    "-e",
    `COREQUEST_STDIN_BASE64=${encodedStdin}`,
    "-e",
    `COREQUEST_RUN_COMMAND_BASE64=${encodedCommand}`,
    SANDBOX_RUNNER_IMAGE,
    "sh",
    "-c",
    [
      "set -eu",
      "WORKDIR=$(mktemp -d /workspace/run-XXXXXX)",
      "tar -xf - -C \"$WORKDIR\"",
      "printf '%s' \"$COREQUEST_STDIN_BASE64\" | base64 -d > \"$WORKDIR/stdin.txt\"",
      "COMMAND=$(printf '%s' \"$COREQUEST_RUN_COMMAND_BASE64\" | base64 -d)",
      "export PATH=\"/usr/local/cargo/bin:/root/.cargo/bin:$PATH\"",
      "cd \"$WORKDIR\"",
      "eval \"$COMMAND\" < \"$WORKDIR/stdin.txt\"",
    ].join("\n"),
  ];

  return await new Promise<SandboxExecutionResponse>((resolve) => {
    const child = spawn("docker", dockerArgs, {
      stdio: ["pipe", "pipe", "pipe"],
    });

    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];
    let timedOut = false;

    const timeout = setTimeout(() => {
      timedOut = true;
      forceKillProcess(child);
    }, SANDBOX_PROJECT_TIMEOUT_MS);

    child.stdout.on("data", (chunk: Buffer) => stdoutChunks.push(chunk));
    child.stderr.on("data", (chunk: Buffer) => stderrChunks.push(chunk));

    child.on("error", (error) => {
      clearTimeout(timeout);
      resolve({
        status: "sandbox_error",
        stdout: "",
        stderr: error.message,
        durationMs: Math.round(performance.now() - startTime),
      });
    });

    child.on("close", (exitCode) => {
      clearTimeout(timeout);

      if (timedOut) {
        resolve({
          status: "timeout",
          stdout: bufferToString(stdoutChunks),
          stderr: "Le projet a dépassé le temps autorisé.",
          durationMs: SANDBOX_PROJECT_TIMEOUT_MS,
        });
        return;
      }

      const stdout = bufferToString(stdoutChunks);
      const stderr = bufferToString(stderrChunks);
      const durationMs = Math.round(performance.now() - startTime);

      if (exitCode === 0) {
        resolve({
          status: "success",
          stdout,
          stderr,
          durationMs,
        });
        return;
      }

      if (exitCode === DOCKER_FAILURE_EXIT_CODE || exitCode === null) {
        resolve({
          status: "sandbox_error",
          stdout,
          stderr: stderr || "Erreur technique lors du lancement du conteneur sandbox projet.",
          durationMs,
        });
        return;
      }

      resolve({
        status: classifyProjectFailure(stderr),
        stdout,
        stderr,
        durationMs,
      });
    });

    child.stdin.end(archiveBuffer);
  });
}

function classifyProjectFailure(stderr: string): "compile_error" | "runtime_error" {
  return /could not compile|error\[[A-Z0-9]+\]|aborting due to/i.test(stderr) ? "compile_error" : "runtime_error";
}

function bufferToString(chunks: Buffer[]): string {
  return Buffer.concat(chunks).toString("utf8");
}

function isSafeRelativePath(path: string) {
  const normalized = normalize(path).replaceAll('\\', '/');
  return normalized.length > 0 && !normalized.startsWith('/') && !normalized.startsWith('..') && !normalized.includes('/../');
}