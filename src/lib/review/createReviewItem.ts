import { getContentEntryById } from "@/lib/content/getCurriculum";
import { getNextReviewDate, MIN_LEITNER_BOX } from "@/lib/review/leitner";

type ReviewClientError = {
  code?: string | null;
  message?: string | null;
};

type ReviewItemWriteClient = {
  from: (table: string) => {
    upsert: (
      values: Record<string, unknown>,
      options: { ignoreDuplicates: boolean; onConflict: string },
    ) => PromiseLike<{ error: ReviewClientError | null }>;
  };
};

type CreateReviewItemInput = {
  completedAt?: Date;
  contentId: string;
  userId: string;
};

export type CreateReviewItemResult =
  | {
      status: "scheduled";
      contentId: string;
      nextReviewAt: string;
    }
  | {
      status: "skipped";
      contentId: string;
      reason: "not_revisable";
    };

export async function createReviewItemForCompletedExercise(
  supabase: ReviewItemWriteClient,
  input: CreateReviewItemInput,
): Promise<CreateReviewItemResult> {
  const content = getContentEntryById(input.contentId);

  if (content?.type !== "exercise") {
    return {
      status: "skipped",
      contentId: input.contentId,
      reason: "not_revisable",
    };
  }

  const nextReviewAt = getNextReviewDate(MIN_LEITNER_BOX, input.completedAt ?? new Date()).toISOString();
  const { error } = await supabase.from("review_items").upsert(
    {
      user_id: input.userId,
      content_id: input.contentId,
      content_type: "exercise",
      leitner_box: MIN_LEITNER_BOX,
      next_review_at: nextReviewAt,
    },
    {
      onConflict: "user_id,content_id",
      ignoreDuplicates: true,
    },
  );

  if (error) {
    throw error;
  }

  return {
    status: "scheduled",
    contentId: input.contentId,
    nextReviewAt,
  };
}
