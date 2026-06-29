import { spawn } from "node:child_process";
import { performance } from "node:perf_hooks";
import { forceKillProcess } from "./cleanup.ts";
import {
  SANDBOX_CODE_MAX_LENGTH,
  SANDBOX_CPU_LIMIT,
  SANDBOX_MEMORY_LIMIT,
  SANDBOX_PIDS_LIMIT,
  SANDBOX_RUNNER_IMAGE,
  SANDBOX_STDIN_MAX_LENGTH,
  SANDBOX_TIMEOUT_MS,
} from "./securityLimits.ts";
import type { SandboxExecutionResponse } from "./types.ts";

const COMPILE_ERROR_EXIT_CODE = 91;
const DOCKER_FAILURE_EXIT_CODE = 125;

export async function executeRust(code: string, stdin: string | null = null): Promise<SandboxExecutionResponse> {
  if (code.trim().length === 0) {
    return {
      status: "compile_error",
      stdout: "",
      stderr: "Aucun code Rust fourni.",
      durationMs: 0,
    };
  }

  if (code.length > SANDBOX_CODE_MAX_LENGTH) {
    return {
      status: "sandbox_error",
      stdout: "",
      stderr: "Le code dépasse la taille autorisée pour le MVP.",
      durationMs: 0,
    };
  }

  if ((stdin ?? "").length > SANDBOX_STDIN_MAX_LENGTH) {
    return {
      status: "sandbox_error",
      stdout: "",
      stderr: "L'entrée standard dépasse la taille autorisée pour le MVP.",
      durationMs: 0,
    };
  }

  const encodedCode = Buffer.from(code, "utf8").toString("base64");
  const encodedStdin = Buffer.from(stdin ?? "", "utf8").toString("base64");
  const startTime = performance.now();
  const dockerArgs = [
    "run",
    "--rm",
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
    `COREQUEST_CODE_BASE64=${encodedCode}`,
    "-e",
    `COREQUEST_STDIN_BASE64=${encodedStdin}`,
    SANDBOX_RUNNER_IMAGE,
    "sh",
    "-c",
    [
      "set -eu",
      "WORKDIR=$(mktemp -d /workspace/run-XXXXXX)",
      "printf '%s' \"$COREQUEST_CODE_BASE64\" | base64 -d > \"$WORKDIR/main.rs\"",
      "printf '%s' \"$COREQUEST_STDIN_BASE64\" | base64 -d > \"$WORKDIR/stdin.txt\"",
      "if ! rustc \"$WORKDIR/main.rs\" -o \"$WORKDIR/app\" 2>\"$WORKDIR/compile.stderr\"; then",
      "  cat \"$WORKDIR/compile.stderr\" >&2",
      `  exit ${COMPILE_ERROR_EXIT_CODE}`,
      "fi",
      "\"$WORKDIR/app\" < \"$WORKDIR/stdin.txt\"",
    ].join("\n"),
  ];

  return await new Promise<SandboxExecutionResponse>((resolve) => {
    const child = spawn("docker", dockerArgs, {
      stdio: ["ignore", "pipe", "pipe"],
    });

    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];
    let timedOut = false;

    const timeout = setTimeout(() => {
      timedOut = true;
      forceKillProcess(child);
    }, SANDBOX_TIMEOUT_MS);

    child.stdout.on("data", (chunk: Buffer) => {
      stdoutChunks.push(chunk);
    });

    child.stderr.on("data", (chunk: Buffer) => {
      stderrChunks.push(chunk);
    });

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
          stderr: "Le programme a dépassé le temps autorisé.",
          durationMs: SANDBOX_TIMEOUT_MS,
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

      if (exitCode === COMPILE_ERROR_EXIT_CODE) {
        resolve({
          status: "compile_error",
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
          stderr: stderr || "Erreur technique lors du lancement du conteneur sandbox.",
          durationMs,
        });
        return;
      }

      resolve({
        status: "runtime_error",
        stdout,
        stderr,
        durationMs,
      });
    });
  });
}

function bufferToString(chunks: Buffer[]): string {
  return Buffer.concat(chunks).toString("utf8");
}