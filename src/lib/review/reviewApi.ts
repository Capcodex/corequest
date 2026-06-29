import { DEFAULT_DAILY_REVIEW_LIMIT } from "@/lib/review/getDailyReviewSession";
import { ReviewResult, SubmitReviewRequest } from "@/types/review";

const MAX_DAILY_REVIEW_LIMIT = 10;
const MIN_DAILY_REVIEW_LIMIT = 1;

type ReviewAuthClient = {
  auth: {
    getUser: () => Promise<{
      data: {
        user: { id: string } | null;
      };
    }>;
  };
};

export async function getAuthenticatedReviewUserId(supabase: ReviewAuthClient): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

export function parseDailyReviewLimit(value: string | null): number {
  if (!value) {
    return DEFAULT_DAILY_REVIEW_LIMIT;
  }

  const parsedLimit = Number(value);

  if (!Number.isInteger(parsedLimit)) {
    return DEFAULT_DAILY_REVIEW_LIMIT;
  }

  return Math.min(Math.max(parsedLimit, MIN_DAILY_REVIEW_LIMIT), MAX_DAILY_REVIEW_LIMIT);
}

export function parseSubmitReviewPayload(payload: unknown): SubmitReviewRequest | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const contentId = "contentId" in payload ? payload.contentId : null;
  const explicitResult = "result" in payload ? payload.result : null;
  const success = "success" in payload ? payload.success : null;

  if (typeof contentId !== "string" || contentId.trim().length === 0) {
    return null;
  }

  if (isReviewResult(explicitResult)) {
    return {
      contentId: contentId.trim(),
      result: explicitResult,
    };
  }

  if (typeof success === "boolean") {
    return {
      contentId: contentId.trim(),
      result: success ? "success" : "failure",
    };
  }

  return null;
}

export function getSubmitReviewErrorStatus(error: unknown): number {
  const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";

  switch (message) {
    case "REVIEW_PAYLOAD_INVALID":
      return 400;
    case "REVIEW_EXERCISE_NOT_FOUND":
    case "REVIEW_ITEM_NOT_FOUND":
      return 404;
    case "REVIEW_EXERCISE_NOT_COMPLETED":
      return 403;
    default:
      return 400;
  }
}

function isReviewResult(value: unknown): value is ReviewResult {
  return value === "success" || value === "failure";
}
