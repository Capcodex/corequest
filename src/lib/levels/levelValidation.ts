import { ExerciseValidation } from "@/types/content";

type ValidationResult = {
  passed: boolean;
  expectedOutput?: string;
};

export function normalizeOutput(output: string): string {
  return output.replace(/\r\n/g, "\n").trim();
}

export function isExpectedOutput(actualOutput: string, expectedOutput: string): boolean {
  return normalizeOutput(actualOutput) === normalizeOutput(expectedOutput);
}

export function validateExerciseResult(
  actualOutput: string,
  validation: ExerciseValidation,
): ValidationResult {
  switch (validation.mode) {
    case "stdout_exact": {
      const passed = isExpectedOutput(actualOutput, validation.expectedOutput);
      return {
        passed,
        expectedOutput: passed ? undefined : validation.expectedOutput,
      };
    }
    case "stdout_includes": {
      const passed = normalizeOutput(actualOutput).includes(normalizeOutput(validation.expectedOutput));
      return {
        passed,
        expectedOutput: passed ? undefined : validation.expectedOutput,
      };
    }
    case "exit_success":
      return { passed: true };
    default:
      return { passed: false };
  }
}
