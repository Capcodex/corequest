import { describe, expect, it } from "vitest";
import { getCrabProgress } from "../src/lib/progress/crabProgress";

describe("getCrabProgress", () => {
  it("starts the crab at level 1", () => {
    expect(getCrabProgress(0)).toMatchObject({
      level: 1,
      nextLevel: 2,
      xpRemainingToNextLevel: 75,
    });
  });

  it("reaches level 2 after the first three exercises", () => {
    expect(getCrabProgress(75)).toMatchObject({
      level: 2,
      title: "Éclaireur",
      nextLevel: 3,
    });
  });

  it("keeps nonlinear thresholds across the longer curriculum", () => {
    expect(getCrabProgress(824)).toMatchObject({
      level: 4,
      nextLevel: 5,
      xpRemainingToNextLevel: 1,
    });
    expect(getCrabProgress(825)).toMatchObject({
      level: 5,
      title: "Technicien",
      nextLevel: 6,
    });
  });

  it("caps the crab at the current final content milestone", () => {
    expect(getCrabProgress(7420)).toMatchObject({
      level: 12,
      nextLevel: null,
      xpRemainingToNextLevel: 0,
      isMaxLevel: true,
    });
  });
});
