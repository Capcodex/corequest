import { NextRequest, NextResponse } from "next/server";
import { getLevelById } from "@/lib/levels/getLevelById";
import { isExpectedOutput } from "@/lib/levels/levelValidation";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { recordSubmission } from "@/lib/progress/recordSubmission";
import { executeRustCode } from "@/lib/sandbox/executeRustCode";
import { ExecuteCodeRequest, ExecutionResult } from "@/types/execution";

const MAX_CODE_LENGTH = 12_000;

export async function POST(request: NextRequest) {
  let payload: ExecuteCodeRequest;

  try {
    payload = (await request.json()) as ExecuteCodeRequest;
  } catch {
    return NextResponse.json({ error: "Payload JSON invalide." }, { status: 400 });
  }

  if (!payload.levelId || !payload.code) {
    return NextResponse.json(
      { error: "levelId et code sont obligatoires." },
      { status: 400 },
    );
  }

  if (payload.code.trim().length === 0) {
    return NextResponse.json({ error: "Le code ne peut pas être vide." }, { status: 400 });
  }

  if (payload.code.length > MAX_CODE_LENGTH) {
    return NextResponse.json(
      { error: "Le code dépasse la limite autorisée pour le MVP." },
      { status: 400 },
    );
  }

  const level = getLevelById(payload.levelId);

  if (!level) {
    return NextResponse.json({ error: "Niveau introuvable." }, { status: 404 });
  }

  try {
    await trackEvent({
      anonymousSessionId: payload.anonymousSessionId ?? null,
      eventName: "code_execution_started",
      properties: {
        levelId: payload.levelId,
      },
    });

    const sandboxResult = await executeRustCode(payload.code);

    let responsePayload: ExecutionResult = {
      ...sandboxResult,
      passed: false,
    };

    if (sandboxResult.status === "success") {
      const passed = isExpectedOutput(sandboxResult.stdout, level.expectedOutput);

      responsePayload = {
        ...sandboxResult,
        status: passed ? "success" : "wrong_output",
        passed,
        expectedOutput: passed ? undefined : level.expectedOutput,
      };
    }

    await trackEvent({
      anonymousSessionId: payload.anonymousSessionId ?? null,
      eventName: "code_execution_completed",
      properties: {
        levelId: payload.levelId,
        status: responsePayload.status,
        passed: responsePayload.passed,
      },
    });

    if (responsePayload.status === "compile_error") {
      await trackEvent({
        anonymousSessionId: payload.anonymousSessionId ?? null,
        eventName: "code_compile_error",
        properties: {
          levelId: payload.levelId,
        },
      });
    }

    if (responsePayload.status === "wrong_output") {
      await trackEvent({
        anonymousSessionId: payload.anonymousSessionId ?? null,
        eventName: "code_wrong_output",
        properties: {
          levelId: payload.levelId,
        },
      });
    }

    if (responsePayload.status === "timeout") {
      await trackEvent({
        anonymousSessionId: payload.anonymousSessionId ?? null,
        eventName: "code_timeout",
        properties: {
          levelId: payload.levelId,
        },
      });
    }

    if (responsePayload.passed) {
      await trackEvent({
        anonymousSessionId: payload.anonymousSessionId ?? null,
        eventName: "level_completed",
        properties: {
          levelId: payload.levelId,
        },
      });
    }

    await recordSubmission({
      code: payload.code,
      levelId: payload.levelId,
      result: responsePayload,
    });

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("Execute API error:", error);

    await trackEvent({
      anonymousSessionId: payload.anonymousSessionId ?? null,
      eventName: "code_execution_completed",
      properties: {
        levelId: payload.levelId,
        status: "sandbox_error",
        passed: false,
      },
    });

    return NextResponse.json<ExecutionResult>({
      status: "sandbox_error",
      stdout: "",
      stderr: "Une erreur technique est survenue côté sandbox.",
      durationMs: 0,
      passed: false,
    });
  }
}
