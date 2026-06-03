export function normalizeOutput(output: string): string {
  return output.replace(/\r\n/g, "\n").trim();
}

export function isExpectedOutput(actualOutput: string, expectedOutput: string): boolean {
  return normalizeOutput(actualOutput) === normalizeOutput(expectedOutput);
}
