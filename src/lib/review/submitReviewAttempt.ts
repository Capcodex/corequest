import { getContentEntryById } from "@/lib/content/getCurriculum";
import { promoteReviewItem, resetReviewItem } from "@/lib/review/leitner";
import { mapReviewItemRow, ReviewItemRow } from "@/lib/review/getDailyReviewSession";
import { createClient } from "@/lib/supabase/server";
import { ReviewAttempt, ReviewItem, ReviewResult, SubmitReviewRequest, SubmitReviewResponse } from "@/types/review";

type ReviewClientError = {
  code?: string | null;
  message?: string | null;
};

type CompletionRow = {
  level_id: string;
};

type ReviewAttemptRow = {
  id: string;
  user_id: string;
  review_item_id: string;
  content_id: string;
  result: ReviewResult;
  previous_box: 1 | 2 | 3 | 4 | 5 | 6;
  next_box: 1 | 2 | 3 | 4 | 5 | 6;
  reviewed_at: string;
};

type ReviewRepository = {
  getCompletedExercise: (userId: string, contentId: string) => Promise<CompletionRow | null>;
  getReviewItem: (userId: string, contentId: string) => Promise<ReviewItem | null>;
  insertReviewAttempt: (attempt: ReviewAttemptInsert) => Promise<ReviewAttempt>;
  updateReviewItem: (userId: string, itemId: string, item: ReviewItem) => Promise<ReviewItem>;
};

type ReviewAttemptInsert = {
  user_id: string;
  review_item_id: string;
  content_id: string;
  result: ReviewResult;
  previous_box: 1 | 2 | 3 | 4 | 5 | 6;
  next_box: 1 | 2 | 3 | 4 | 5 | 6;
  reviewed_at: string;
};

type SubmitReviewAttemptOptions = {
  now?: Date;
  repository?: ReviewRepository;
  supabase?: unknown;
};

export async function submitReviewAttempt(
  userId: string,
  request: SubmitReviewRequest,
  options: SubmitReviewAttemptOptions = {},
): Promise<SubmitReviewResponse> {
  const content = getContentEntryById(request.contentId);

  if (content?.type !== "exercise") {
    throw new Error("REVIEW_EXERCISE_NOT_FOUND");
  }

  const repository =
    options.repository ?? createSupabaseReviewRepository(options.supabase ?? (await createClient()));
  const completedExercise = await repository.getCompletedExercise(userId, request.contentId);

  if (!completedExercise) {
    throw new Error("REVIEW_EXERCISE_NOT_COMPLETED");
  }

  const currentItem = await repository.getReviewItem(userId, request.contentId);

  if (!currentItem) {
    throw new Error("REVIEW_ITEM_NOT_FOUND");
  }

  const reviewedAt = options.now ?? new Date();
  const nextItem =
    request.result === "success"
      ? promoteReviewItem(currentItem, reviewedAt)
      : resetReviewItem(currentItem, reviewedAt);
  const updatedItem = await repository.updateReviewItem(userId, currentItem.id, nextItem);
  const attempt = await repository.insertReviewAttempt({
    user_id: userId,
    review_item_id: currentItem.id,
    content_id: request.contentId,
    result: request.result,
    previous_box: currentItem.leitnerBox,
    next_box: updatedItem.leitnerBox,
    reviewed_at: reviewedAt.toISOString(),
  });

  return {
    attempt,
    reviewItem: updatedItem,
  };
}

function createSupabaseReviewRepository(supabase: unknown): ReviewRepository {
  const client = supabase as Awaited<ReturnType<typeof createClient>>;

  return {
    async getCompletedExercise(userId, contentId) {
      const { data, error } = await client
        .from("level_completions")
        .select("level_id")
        .eq("user_id", userId)
        .eq("level_id", contentId)
        .maybeSingle<CompletionRow>();

      if (error) {
        throw error;
      }

      return data ?? null;
    },
    async getReviewItem(userId, contentId) {
      const { data, error } = await client
        .from("review_items")
        .select(reviewItemColumns)
        .eq("user_id", userId)
        .eq("content_id", contentId)
        .eq("content_type", "exercise")
        .maybeSingle<ReviewItemRow>();

      if (error) {
        throw error;
      }

      return data ? mapReviewItemRow(data) : null;
    },
    async updateReviewItem(userId, itemId, item) {
      const { data, error } = await client
        .from("review_items")
        .update({
          leitner_box: item.leitnerBox,
          last_reviewed_at: item.lastReviewedAt,
          next_review_at: item.nextReviewAt,
          success_count: item.successCount,
          failure_count: item.failureCount,
        })
        .eq("user_id", userId)
        .eq("id", itemId)
        .select(reviewItemColumns)
        .maybeSingle<ReviewItemRow>();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("REVIEW_ITEM_NOT_FOUND");
      }

      return mapReviewItemRow(data);
    },
    async insertReviewAttempt(attempt) {
      const { data, error } = await client
        .from("review_attempts")
        .insert(attempt)
        .select(reviewAttemptColumns)
        .maybeSingle<ReviewAttemptRow>();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("REVIEW_ATTEMPT_NOT_RECORDED");
      }

      return mapReviewAttemptRow(data);
    },
  };
}

function mapReviewAttemptRow(row: ReviewAttemptRow): ReviewAttempt {
  return {
    id: row.id,
    userId: row.user_id,
    reviewItemId: row.review_item_id,
    contentId: row.content_id,
    result: row.result,
    previousBox: row.previous_box,
    nextBox: row.next_box,
    reviewedAt: row.reviewed_at,
  };
}

const reviewItemColumns = [
  "id",
  "user_id",
  "content_id",
  "content_type",
  "leitner_box",
  "last_reviewed_at",
  "next_review_at",
  "success_count",
  "failure_count",
  "created_at",
  "updated_at",
].join(", ");

const reviewAttemptColumns = [
  "id",
  "user_id",
  "review_item_id",
  "content_id",
  "result",
  "previous_box",
  "next_box",
  "reviewed_at",
].join(", ");
