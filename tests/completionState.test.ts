import { describe, expect, it } from "vitest";
import { buildCompletionState } from "../src/lib/progress/completionState";

describe("buildCompletionState", () => {
  it("grants XP and advances to the next level on first success", () => {
    expect(
      buildCompletionState({
        currentLevelId: "rust-level-1",
        levelId: "rust-level-1",
        nextLevelId: "rust-level-2",
        xpAward: 25,
        xpGranted: true,
        xpTotal: 0,
      }),
    ).toEqual({
      currentLevelId: "rust-level-2",
      xpTotal: 25,
    });
  });

  it("does not grant XP twice for the same level", () => {
    expect(
      buildCompletionState({
        currentLevelId: "rust-level-2",
        levelId: "rust-level-1",
        nextLevelId: "rust-level-2",
        xpAward: 25,
        xpGranted: false,
        xpTotal: 25,
      }),
    ).toEqual({
      currentLevelId: "rust-level-2",
      xpTotal: 25,
    });
  });

  it("keeps the current level when there is no next level", () => {
    expect(
      buildCompletionState({
        currentLevelId: "rust-level-20",
        levelId: "rust-level-20",
        nextLevelId: null,
        xpAward: 115,
        xpGranted: true,
        xpTotal: 320,
      }),
    ).toEqual({
      currentLevelId: "rust-level-20",
      xpTotal: 435,
    });
  });
});
