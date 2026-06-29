import { SandboxProjectExecutionRequest, SandboxProjectExecutionResult } from "@/types/projectExecution";

const sandboxServiceUrl = process.env.SANDBOX_SERVICE_URL ?? "http://sandbox-service:4000";

export async function executeRustProject(
  payload: SandboxProjectExecutionRequest,
): Promise<SandboxProjectExecutionResult> {
  const response = await fetch(`${sandboxServiceUrl}/execute-project`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Sandbox projet indisponible (${response.status})`);
  }

  return (await response.json()) as SandboxProjectExecutionResult;
}