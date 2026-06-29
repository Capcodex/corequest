import { describe, expect, it } from "vitest";
import { getExerciseEntries } from "../src/lib/content/getCurriculum";
import { submitReviewAttempt } from "../src/lib/review/submitReviewAttempt";
import { ReviewAttempt, ReviewItem } from "../src/types/review";

const exercises = getExerciseEntries();
const reviewedAt = new Date("2026-06-10T08:00:00.000Z");

function buildReviewItem(overrides: Partial<ReviewItem> = {}): ReviewItem {
  const contentId = overrides.contentId ?? exercises[0].id;

  return {
    id: `review-${contentId}`,
    userId: "user-1",
    contentId,
    contentType: "exercise",
    leitnerBox: 1,
    lastReviewedAt: null,
    nextReviewAt: "2026-06-10T08:00:00.000Z",
    successCount: 0,
    failureCount: 0,
    createdAt: "2026-06-09T08:00:00.000Z",
    updatedAt: "2026-06-09T08:00:00.000Z",
    ...overrides,
  };
}

function createRepository(input: { completed?: boolean; item?: ReviewItem | null }) {
  const updates: ReviewItem[] = [];
  const attempts: ReviewAttempt[] = [];

  return {
    updates,
    attempts,
    repository: {
      getCompletedExercise: async () => (input.completed === false ? null : { level_id: exercises[0].id }),
      getReviewItem: async () => (Object.hasOwn(input, "item") ? input.item ?? null : buildReviewItem()),
      updateReviewItem: async (_userId: string, _itemId: string, item: ReviewItem) => {
        updates.push(item);
        return item;
      },
      insertReviewAttempt: async (attempt: {
        user_id: string;
        review_item_id: string;
        content_id: string;
        result: "success" | "failure";
        previous_box: 1 | 2 | 3 | 4 | 5 | 6;
        next_box: 1 | 2 | 3 | 4 | 5 | 6;
        reviewed_at: string;
      }) => {
        const savedAttempt: ReviewAttempt = {
          id: "attempt-1",
          userId: attempt.user_id,
          reviewItemId: attempt.review_item_id,
          contentId: attempt.content_id,
          result: attempt.result,
          previousBox: attempt.previous_box,
          nextBox: attempt.next_box,
          reviewedAt: attempt.reviewed_at,
        };
        attempts.push(savedAttempt);
        return savedAttempt;
      },
    },
  };
}

describe("submitReviewAttempt", () => {
  it("promotes a completed exercise after a successful review", async () => {
    const fake = createRepository({ item: buildReviewItem({ leitnerBox: 2, successCount: 3 }) });

    const response = await submitReviewAttempt(
      "user-1",
      {
        contentId: exercises[0].id,
        result: "success",
      },
      {
        now: reviewedAt,
        repository: fake.repository,
      },
    );

    expect(response.reviewItem).toMatchObject({
      leitnerBox: 3,
      successCount: 4,
      nextReviewAt: "2026-06-14T08:00:00.000Z",
    });
    expect(response.attempt).toMatchObject({
      result: "success",
      previousBox: 2,
      nextBox: 3,
      reviewedAt: "2026-06-10T08:00:00.000Z",
    });
    expect(fake.updates).toHaveLength(1);
    expect(fake.attempts).toHaveLength(1);
  });

  it("resets to the first box after a failed review", async () => {
    const fake = createRepository({ item: buildReviewItem({ failureCount: 1, leitnerBox: 5 }) });

    const response = await submitReviewAttempt(
      "user-1",
      {
        contentId: exercises[0].id,
        result: "failure",
      },
      {
        now: reviewedAt,
        repository: fake.repository,
      },
    );

    expect(response.reviewItem).toMatchObject({
      failureCount: 2,
      leitnerBox: 1,
      nextReviewAt: "2026-06-11T08:00:00.000Z",
    });
    expect(response.attempt).toMatchObject({
      result: "failure",
      previousBox: 5,
      nextBox: 1,
    });
  });

  it("rejects a review for an exercise that is not completed yet", async () => {
    const fake = createRepository({ completed: false });

    await expect(
      submitReviewAttempt(
        "user-1",
        {
          contentId: exercises[0].id,
          result: "success",
        },
        {
          now: reviewedAt,
          repository: fake.repository,
        },
      ),
    ).rejects.toThrow("REVIEW_EXERCISE_NOT_COMPLETED");
  });

  it("rejects an unknown review item", async () => {
    const fake = createRepository({ item: null });

    await expect(
      submitReviewAttempt(
        "user-1",
        {
          contentId: exercises[0].id,
          result: "success",
        },
        {
          now: reviewedAt,
          repository: fake.repository,
        },
      ),
    ).rejects.toThrow("REVIEW_ITEM_NOT_FOUND");
  });

  it("rejects non-exercise content", async () => {
    const fake = createRepository({});

    await expect(
      submitReviewAttempt(
        "user-1",
        {
          contentId: "project-level-1-core-console",
          result: "success",
        },
        {
          now: reviewedAt,
          repository: fake.repository,
        },
      ),
    ).rejects.toThrow("REVIEW_EXERCISE_NOT_FOUND");
  });
});
