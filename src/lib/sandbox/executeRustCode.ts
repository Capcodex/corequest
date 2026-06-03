import { SandboxExecutionResult } from "@/types/execution";

const sandboxServiceUrl = process.env.SANDBOX_SERVICE_URL ?? "http://localhost:4000";

export async function executeRustCode(code: string): Promise<SandboxExecutionResult> {
  const response = await fetch(`${sandboxServiceUrl}/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Sandbox request failed with status ${response.status}`);
  }

  return (await response.json()) as SandboxExecutionResult;
}
