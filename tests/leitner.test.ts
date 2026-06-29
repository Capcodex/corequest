import { describe, expect, it } from "vitest";
import {
  getNextReviewDate,
  promoteLeitnerBox,
  promoteReviewItem,
  resetLeitnerBox,
  resetReviewItem,
  REVIEW_INTERVAL_DAYS,
} from "../src/lib/review/leitner";
import { ReviewItemScheduleState } from "../src/lib/review/leitner";

const reviewedAt = new Date("2026-06-10T08:00:00.000Z");

function buildReviewItem(overrides: Partial<ReviewItemScheduleState> = {}): ReviewItemScheduleState {
  return {
    failureCount: 0,
    lastReviewedAt: null,
    leitnerBox: 1,
    nextReviewAt: "2026-06-11T08:00:00.000Z",
    successCount: 0,
    ...overrides,
  };
}

describe("leitner review rules", () => {
  it("defines nonlinear review intervals", () => {
    expect(REVIEW_INTERVAL_DAYS).toEqual({
      1: 1,
      2: 2,
      3: 4,
      4: 7,
      5: 14,
      6: 30,
    });
  });

  it("computes the next review date from the target box", () => {
    expect(getNextReviewDate(1, reviewedAt).toISOString()).toBe("2026-06-11T08:00:00.000Z");
    expect(getNextReviewDate(4, reviewedAt).toISOString()).toBe("2026-06-17T08:00:00.000Z");
    expect(getNextReviewDate(6, reviewedAt).toISOString()).toBe("2026-07-10T08:00:00.000Z");
  });

  it("promotes boxes up to the maximum box", () => {
    expect(promoteLeitnerBox(1)).toBe(2);
    expect(promoteLeitnerBox(5)).toBe(6);
    expect(promoteLeitnerBox(6)).toBe(6);
  });

  it("resets boxes to the first box after a failure", () => {
    expect(resetLeitnerBox()).toBe(1);
  });

  it("promotes a review item after success", () => {
    const item = promoteReviewItem(buildReviewItem({ leitnerBox: 2, successCount: 3 }), reviewedAt);

    expect(item).toMatchObject({
      failureCount: 0,
      lastReviewedAt: "2026-06-10T08:00:00.000Z",
      leitnerBox: 3,
      nextReviewAt: "2026-06-14T08:00:00.000Z",
      successCount: 4,
    });
  });

  it("resets a review item after failure", () => {
    const item = resetReviewItem(buildReviewItem({ failureCount: 2, leitnerBox: 5, successCount: 6 }), reviewedAt);

    expect(item).toMatchObject({
      failureCount: 3,
      lastReviewedAt: "2026-06-10T08:00:00.000Z",
      leitnerBox: 1,
      nextReviewAt: "2026-06-11T08:00:00.000Z",
      successCount: 6,
    });
  });
});
