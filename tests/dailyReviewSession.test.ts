import { describe, expect, it } from "vitest";
import { getExerciseEntries } from "../src/lib/content/getCurriculum";
import {
  buildDailyReviewSessionItems,
  getDailyReviewSession,
  ReviewItemRow,
} from "../src/lib/review/getDailyReviewSession";

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
            lteFilters: new Map<string, string>(),
            limitCount: Number.POSITIVE_INFINITY,
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
            lte(column: string, value: string) {
              state.lteFilters.set(column, value);
              return builder;
            },
            order() {
              return builder;
            },
            limit(count: number) {
              state.limitCount = count;
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
    lteFilters: Map<string, string>;
    limitCount: number;
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
  const dueAt = state.lteFilters.get("next_review_at") ?? now.toISOString();
  const rows = input.reviewRows
    .filter((row) => row.user_id === state.filters.get("user_id"))
    .filter((row) => row.content_type === state.filters.get("content_type"))
    .filter((row) => contentIds.includes(row.content_id))
    .filter((row) => row.next_review_at <= dueAt)
    .slice(0, state.limitCount);

  return {
    data: rows,
    error: null,
  };
}

describe("daily review session", () => {
  it("returns an empty session when nothing is completed", async () => {
    const session = await getDailyReviewSession("user-1", {
      now,
      supabase: createFakeSupabase({ completedContentIds: [], reviewRows: [] }),
    });

    expect(session.items).toEqual([]);
    expect(session.dueCount).toBe(0);
    expect(session.hasMore).toBe(false);
  });

  it("keeps only due items for completed exercises and applies the daily limit", async () => {
    const dueRows = exercises.slice(0, 8).map((exercise, index) =>
      buildRow({
        content_id: exercise.id,
        next_review_at: `2026-06-0${index + 1}T08:00:00.000Z`,
      }),
    );
    const futureRow = buildRow({
      content_id: exercises[8].id,
      next_review_at: "2026-06-12T08:00:00.000Z",
    });

    const session = await getDailyReviewSession("user-1", {
      limit: 5,
      now,
      supabase: createFakeSupabase({
        completedContentIds: exercises.slice(0, 9).map((exercise) => exercise.id),
        reviewRows: [...dueRows, futureRow],
      }),
    });

    expect(session.dueCount).toBe(8);
    expect(session.items).toHaveLength(5);
    expect(session.hasMore).toBe(true);
    expect(session.items.map((item) => item.reviewItem.contentId)).toEqual(
      dueRows.slice(0, 5).map((row) => row.content_id),
    );
  });

  it("prioritizes overdue items before lower boxes, then lower boxes at equal due date", () => {
    const rows = [
      buildRow({
        content_id: exercises[0].id,
        leitner_box: 1,
        next_review_at: "2026-06-10T08:00:00.000Z",
      }),
      buildRow({
        content_id: exercises[1].id,
        leitner_box: 6,
        next_review_at: "2026-06-08T08:00:00.000Z",
      }),
      buildRow({
        content_id: exercises[2].id,
        leitner_box: 2,
        next_review_at: "2026-06-10T08:00:00.000Z",
      }),
    ];

    const items = buildDailyReviewSessionItems(rows, rows.map((row) => row.content_id), {
      now,
      seed: "user-1:2026-06-10",
    });

    expect(items.map((item) => item.reviewItem.contentId)).toEqual([
      exercises[1].id,
      exercises[0].id,
      exercises[2].id,
    ]);
    expect(items[0].overdueDays).toBe(2);
  });
});
