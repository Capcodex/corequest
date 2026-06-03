import type { ChildProcessWithoutNullStreams } from "node:child_process";

export function forceKillProcess(process: ChildProcessWithoutNullStreams): void {
  if (process.killed) {
    return;
  }

  try {
    process.kill("SIGKILL");
  } catch {
    // Ignore cleanup errors here; the caller reports the sandbox failure.
  }
}
