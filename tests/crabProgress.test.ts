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

  it("uses nonlinear thresholds for later levels", () => {
    expect(getCrabProgress(359)).toMatchObject({
      level: 3,
      nextLevel: 4,
      xpRemainingToNextLevel: 1,
    });
    expect(getCrabProgress(360)).toMatchObject({
      level: 4,
      title: "Navigateur",
      nextLevel: 5,
    });
  });

  it("caps the crab at the final level", () => {
    expect(getCrabProgress(1350)).toMatchObject({
      level: 8,
      nextLevel: null,
      xpRemainingToNextLevel: 0,
      isMaxLevel: true,
    });
  });
});
