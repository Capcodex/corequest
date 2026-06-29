import { ExecutionStatus, SandboxExecutionResult } from "@/types/execution";
import { ExerciseValidation, ProjectFile } from "@/types/content";
import { CompleteProjectResult } from "@/types/progress";

export type EditedProjectFile = {
  path: string;
  content: string;
};

export type ExecuteProjectRequest = {
  projectId: string;
  files: EditedProjectFile[];
  stdin?: string | null;
  anonymousSessionId?: string | null;
};

export type ProjectValidationCaseResult = {
  id: string;
  title: string;
  description: string;
  status: ExecutionStatus;
  passed: boolean;
  stdout: string;
  stderr: string;
  durationMs: number;
  expectedOutput?: string;
};

export type ProjectExecutionResult = {
  status: ExecutionStatus;
  passed: boolean;
  stdout: string;
  stderr: string;
  durationMs: number;
};

export type ProjectValidationResult = {
  status: ExecutionStatus;
  passed: boolean;
  durationMs: number;
  caseResults: ProjectValidationCaseResult[];
  completion: CompleteProjectResult | null;
  completionError: string | null;
};

export type SandboxProjectExecutionRequest = {
  files: ProjectFile[];
  runCommand: string;
  stdin?: string | null;
};

export type SandboxProjectExecutionResult = SandboxExecutionResult;

export type ProjectScenarioDefinition = {
  id: string;
  title: string;
  description: string;
  stdin?: string | null;
  validation: ExerciseValidation;
};
