import { describe, expect, it } from "vitest";
import { getLevels } from "../src/lib/levels/getLevels";
import {
  getNextLevelId,
  isLevelUnlocked,
  shouldGrantXp,
} from "../src/lib/progress/progressRules";

describe("progressRules", () => {
  const levels = getLevels();

  it("grants XP only once per level", () => {
    expect(shouldGrantXp([], "rust-level-1")).toBe(true);
    expect(shouldGrantXp(["rust-level-1"], "rust-level-1")).toBe(false);
  });

  it("unlocks the first level by default", () => {
    expect(isLevelUnlocked(levels, [], "rust-level-1")).toBe(true);
  });

  it("locks the second level until the first is completed", () => {
    expect(isLevelUnlocked(levels, [], "rust-level-2")).toBe(false);
    expect(isLevelUnlocked(levels, ["rust-level-1"], "rust-level-2")).toBe(true);
  });

  it("returns the next level id when available", () => {
    expect(getNextLevelId(levels, "rust-level-1")).toBe("rust-level-2");
    expect(getNextLevelId(levels, "rust-level-71")).toBeNull();
  });

  it("exposes the full eighty-one exercise path", () => {
    expect(levels).toHaveLength(85);
    expect(levels.at(-1)?.id).toBe("rust-level-71");
  });
});
