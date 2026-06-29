export type ExecutionStatus =
  | "success"
  | "compile_error"
  | "runtime_error"
  | "wrong_output"
  | "timeout"
  | "sandbox_error";

export type ExecutionResult = {
  status: ExecutionStatus;
  stdout: string;
  stderr: string;
  durationMs: number;
  passed: boolean;
  expectedOutput?: string;
};

export type ExecuteCodeRequest = {
  levelId: string;
  code: string;
  stdin?: string | null;
  anonymousSessionId?: string | null;
};

export type SandboxExecutionResult = {
  status: Exclude<ExecutionStatus, "wrong_output">;
  stdout: string;
  stderr: string;
  durationMs: number;
};
