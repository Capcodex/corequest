import { describe, expect, it } from "vitest";
import { getExerciseEntries } from "../src/lib/content/getCurriculum";
import {
  buildReviewBoxesOverview,
  getReviewBoxesOverview,
} from "../src/lib/review/getReviewBoxesOverview";
import { ReviewItemRow } from "../src/lib/review/getDailyReviewSession";

const exercises = getExerciseEntries();
const now = new Date("2026-06-10T08:00:00.000Z");

function buildRow(overrides: Partial<ReviewItemRow>): ReviewItemRow {
  const contentId = overrides.content_id ?? exercises[0].id;

  return {
    id: `review-${contentId}`,
    user_id: "user-1",
    content_id: contentId,
    content_type: "exercise",
    leitner_box: 1,
    last_reviewed_at: null,
    next_review_at: "2026-06-10T08:00:00.000Z",
    success_count: 0,
    failure_count: 0,
    created_at: "2026-06-09T08:00:00.000Z",
    updated_at: "2026-06-09T08:00:00.000Z",
    ...overrides,
  };
}

function createFakeSupabase(input: { completedContentIds: string[]; reviewRows: ReviewItemRow[] }) {
  return {
    from(table: string) {
      return {
        select() {
          const state = {
            table,
            filters: new Map<string, unknown>(),
            inFilters: new Map<string, unknown[]>(),
          };
          const builder = {
            eq(column: string, value: unknown) {
              state.filters.set(column, value);
              return builder;
            },
            in(column: string, values: unknown[]) {
              state.inFilters.set(column, values);
              return builder;
            },
            order() {
              return builder;
            },
            then<TResult1 = unknown, TResult2 = never>(
              onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null,
              onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
            ) {
              return Promise.resolve(resolveQuery(state, input)).then(onfulfilled, onrejected);
            },
          };

          return builder;
        },
      };
    },
  };
}

function resolveQuery(
  state: {
    table: string;
    filters: Map<string, unknown>;
    inFilters: Map<string, unknown[]>;
  },
  input: { completedContentIds: string[]; reviewRows: ReviewItemRow[] },
) {
  if (state.table === "level_completions") {
    return {
      data: input.completedContentIds.map((contentId) => ({ level_id: contentId })),
      error: null,
    };
  }

  const contentIds = state.inFilters.get("content_id") ?? [];
  const rows = input.reviewRows
    .filter((row) => row.user_id === state.filters.get("user_id"))
    .filter((row) => row.content_type === state.filters.get("content_type"))
    .filter((row) => contentIds.includes(row.content_id));

  return {
    data: rows,
    error: null,
  };
}

describe("review boxes overview", () => {
  it("builds six boxes with due and locked counts", () => {
    const rows = [
      buildRow({
        content_id: exercises[0].id,
        leitner_box: 1,
        next_review_at: "2026-06-10T08:00:00.000Z",
      }),
      buildRow({
        content_id: exercises[1].id,
        leitner_box: 3,
        next_review_at: "2026-06-12T08:00:00.000Z",
      }),
      buildRow({
        content_id: exercises[2].id,
        leitner_box: 3,
        next_review_at: "2026-06-08T08:00:00.000Z",
      }),
    ];

    const overview = buildReviewBoxesOverview("user-1", now.toISOString(), rows, now);

    expect(overview.boxes).toHaveLength(6);
    expect(overview.totalCount).toBe(3);
    expect(overview.dueCount).toBe(2);
    expect(overview.lockedCount).toBe(1);
    expect(overview.boxes[0]).toMatchObject({
      box: 1,
      dueCount: 1,
      lockedCount: 0,
      totalCount: 1,
    });
    expect(overview.boxes[2]).toMatchObject({
      box: 3,
      dueCount: 1,
      lockedCount: 1,
      totalCount: 2,
      nextReviewAt: "2026-06-12T08:00:00.000Z",
    });
    expect(overview.boxes[2].items.map((item) => item.isDue)).toEqual([true, false]);
    expect(overview.boxes[2].items[1].daysUntilReview).toBe(2);
  });

  it("loads all scheduled items for completed exercises, including future reviews", async () => {
    const completedRows = [
      buildRow({
        content_id: exercises[0].id,
        leitner_box: 2,
        next_review_at: "2026-06-13T08:00:00.000Z",
      }),
      buildRow({
        content_id: exercises[1].id,
        leitner_box: 4,
        next_review_at: "2026-06-09T08:00:00.000Z",
      }),
    ];
    const ignoredRow = buildRow({
      content_id: exercises[2].id,
      leitner_box: 6,
      next_review_at: "2026-06-09T08:00:00.000Z",
    });

    const overview = await getReviewBoxesOverview("user-1", {
      now,
      supabase: createFakeSupabase({
        completedContentIds: completedRows.map((row) => row.content_id),
        reviewRows: [...completedRows, ignoredRow],
      }),
    });

    expect(overview.totalCount).toBe(2);
    expect(overview.dueCount).toBe(1);
    expect(overview.boxes[1].items[0].daysUntilReview).toBe(3);
    expect(overview.boxes[3].items[0].overdueDays).toBe(1);
  });
});
