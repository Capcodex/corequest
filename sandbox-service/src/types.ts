export type SandboxExecutionStatus =
  | "success"
  | "compile_error"
  | "runtime_error"
  | "timeout"
  | "sandbox_error";

export type SandboxExecutionRequest = {
  code: string;
  stdin?: string | null;
};

export type SandboxProjectFile = {
  path: string;
  content: string;
};

export type SandboxProjectExecutionRequest = {
  files: SandboxProjectFile[];
  runCommand: string;
  stdin?: string | null;
};

export type SandboxExecutionResponse = {
  status: SandboxExecutionStatus;
  stdout: string;
  stderr: string;
  durationMs: number;
};