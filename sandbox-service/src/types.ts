export type SandboxExecutionStatus =
  | "success"
  | "compile_error"
  | "runtime_error"
  | "timeout"
  | "sandbox_error";

export type SandboxExecutionRequest = {
  code: string;
};

export type SandboxExecutionResponse = {
  status: SandboxExecutionStatus;
  stdout: string;
  stderr: string;
  durationMs: number;
};
