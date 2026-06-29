import { describe, expect, it } from "vitest";
import {
  getAuthenticatedReviewUserId,
  getSubmitReviewErrorStatus,
  parseDailyReviewLimit,
  parseSubmitReviewPayload,
} from "../src/lib/review/reviewApi";

describe("reviewApi helpers", () => {
  it("extracts the authenticated Supabase user id", async () => {
    await expect(
      getAuthenticatedReviewUserId({
        auth: {
          getUser: () => Promise.resolve({ data: { user: { id: "user-1" } } }),
        },
      }),
    ).resolves.toBe("user-1");
  });

  it("returns null when the Supabase session is missing", async () => {
    await expect(
      getAuthenticatedReviewUserId({
        auth: {
          getUser: () => Promise.resolve({ data: { user: null } }),
        },
      }),
    ).resolves.toBeNull();
  });

  it("parses and clamps the daily review limit", () => {
    expect(parseDailyReviewLimit(null)).toBe(7);
    expect(parseDailyReviewLimit("0")).toBe(1);
    expect(parseDailyReviewLimit("42")).toBe(10);
    expect(parseDailyReviewLimit("abc")).toBe(7);
  });

  it("parses a valid review submission payload", () => {
    expect(parseSubmitReviewPayload({ contentId: " rust-level-1 ", result: "success" })).toEqual({
      contentId: "rust-level-1",
      result: "success",
    });
    expect(parseSubmitReviewPayload({ contentId: "rust-level-1", success: false })).toEqual({
      contentId: "rust-level-1",
      result: "failure",
    });
  });

  it("rejects invalid review submission payloads", () => {
    expect(parseSubmitReviewPayload(null)).toBeNull();
    expect(parseSubmitReviewPayload({ contentId: "", result: "success" })).toBeNull();
    expect(parseSubmitReviewPayload({ contentId: "rust-level-1", result: "maybe" })).toBeNull();
  });

  it("maps review domain errors to API statuses", () => {
    expect(getSubmitReviewErrorStatus(new Error("REVIEW_ITEM_NOT_FOUND"))).toBe(404);
    expect(getSubmitReviewErrorStatus(new Error("REVIEW_EXERCISE_NOT_COMPLETED"))).toBe(403);
    expect(getSubmitReviewErrorStatus(new Error("REVIEW_PAYLOAD_INVALID"))).toBe(400);
  });
});
