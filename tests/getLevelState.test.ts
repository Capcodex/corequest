import { describe, expect, it } from "vitest";
import { getLevels } from "../src/lib/levels/getLevels";
import { getLevelState } from "../src/lib/progress/getLevelState";
import { UserProgress } from "../src/types/progress";

describe("getLevelState", () => {
  const levels = getLevels();
  const level1 = levels[0]!;
  const level2 = levels[1]!;
  const level3 = levels[2]!;

  it("marks a completed level as completed", () => {
    const progress: UserProgress = {
      userId: "user-1",
      currentLevelId: "rust-level-2",
      completedLevelIds: ["rust-level-1"],
      xpTotal: 20,
    };

    expect(getLevelState(level1, progress)).toBe("completed");
  });

  it("marks the current level as in progress", () => {
    const progress: UserProgress = {
      userId: "user-1",
      currentLevelId: "rust-level-2",
      completedLevelIds: ["rust-level-1"],
      xpTotal: 20,
    };

    expect(getLevelState(level2, progress, level1.id)).toBe("in_progress");
  });

  it("marks the first level as in progress for a new learner", () => {
    const progress: UserProgress = {
      userId: "user-1",
      currentLevelId: "rust-level-1",
      completedLevelIds: [],
      xpTotal: 0,
    };

    expect(getLevelState(level1, progress)).toBe("in_progress");
  });

  it("unlocks a level when the previous one is completed", () => {
    const progress: UserProgress = {
      userId: "user-1",
      currentLevelId: "rust-level-3",
      completedLevelIds: ["rust-level-1", "rust-level-2"],
      xpTotal: 45,
    };

    expect(getLevelState(level3, progress, level2.id)).toBe("in_progress");
  });

  it("keeps a later level locked when the previous one is not completed", () => {
    const progress: UserProgress = {
      userId: "user-1",
      currentLevelId: "rust-level-1",
      completedLevelIds: [],
      xpTotal: 0,
    };

    expect(getLevelState(level3, progress, level2.id)).toBe("locked");
  });
});
