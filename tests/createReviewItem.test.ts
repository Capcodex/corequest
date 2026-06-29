import { describe, expect, it } from "vitest";
import { getExerciseEntries } from "../src/lib/content/getCurriculum";
import { createReviewItemForCompletedExercise } from "../src/lib/review/createReviewItem";

type UpsertCall = {
  table: string;
  values: Record<string, unknown>;
  options: Record<string, unknown>;
};

function createFakeSupabase() {
  const upserts: UpsertCall[] = [];

  return {
    upserts,
    client: {
      from(table: string) {
        return {
          upsert(values: Record<string, unknown>, options: Record<string, unknown>) {
            upserts.push({ table, values, options });
            return Promise.resolve({ error: null });
          },
        };
      },
    },
  };
}

describe("createReviewItemForCompletedExercise", () => {
  it("schedules a first review one day after an exercise completion", async () => {
    const exercise = getExerciseEntries()[0];
    const fakeSupabase = createFakeSupabase();

    const result = await createReviewItemForCompletedExercise(fakeSupabase.client, {
      completedAt: new Date("2026-06-10T08:00:00.000Z"),
      contentId: exercise.id,
      userId: "user-1",
    });

    expect(result).toEqual({
      status: "scheduled",
      contentId: exercise.id,
      nextReviewAt: "2026-06-11T08:00:00.000Z",
    });
    expect(fakeSupabase.upserts).toHaveLength(1);
    expect(fakeSupabase.upserts[0]).toMatchObject({
      table: "review_items",
      values: {
        user_id: "user-1",
        content_id: exercise.id,
        content_type: "exercise",
        leitner_box: 1,
        next_review_at: "2026-06-11T08:00:00.000Z",
      },
      options: {
        onConflict: "user_id,content_id",
        ignoreDuplicates: true,
      },
    });
  });

  it("skips non-exercise content", async () => {
    const fakeSupabase = createFakeSupabase();

    const result = await createReviewItemForCompletedExercise(fakeSupabase.client, {
      completedAt: new Date("2026-06-10T08:00:00.000Z"),
      contentId: "project-level-1-core-console",
      userId: "user-1",
    });

    expect(result).toEqual({
      status: "skipped",
      contentId: "project-level-1-core-console",
      reason: "not_revisable",
    });
    expect(fakeSupabase.upserts).toHaveLength(0);
  });
});
