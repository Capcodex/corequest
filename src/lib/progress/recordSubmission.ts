import { createClient } from "@/lib/supabase/server";
import { ExecutionResult } from "@/types/execution";

type RecordSubmissionInput = {
  code: string;
  levelId: string;
  result: ExecutionResult;
};

export async function recordSubmission(input: RecordSubmissionInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  await supabase.from("submissions").insert({
    user_id: user.id,
    code: input.code,
    level_id: input.levelId,
    status: input.result.status,
    stdout: input.result.stdout,
    stderr: input.result.stderr,
    duration_ms: input.result.durationMs,
    passed: input.result.passed,
  });
}

