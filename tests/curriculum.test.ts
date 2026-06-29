import { describe, expect, it } from "vitest";
import {
  getContentContextById,
  getCurriculumLevels,
  getExerciseEntries,
} from "../src/lib/content/getCurriculum";
import { isCurriculumLevelUnlocked } from "../src/lib/progress/progressRules";

describe("curriculum model", () => {
  it("keeps a flattened exercise sequence for the current app", () => {
    const exercises = getExerciseEntries();

    expect(exercises).toHaveLength(85);
    expect(exercises[0]?.id).toBe("rust-level-1");
    expect(exercises.at(-1)?.id).toBe("rust-level-71");
  });

  it("turns Level 1 into an extended path with a gentler input ramp and a post-project stretch", () => {
    const curriculumLevels = getCurriculumLevels();
    const levelOne = curriculumLevels[0];
    const levelOneExercises = levelOne?.themes
      .flatMap((theme) => theme.chapters)
      .flatMap((chapter) => chapter.contents)
      .filter((content) => content.type === "exercise");
    const inputTheme = levelOne?.themes.find((theme) => theme.id === "theme-level-1-input");

    expect(levelOne?.themes).toHaveLength(9);
    expect(levelOneExercises).toHaveLength(29);
    expect(levelOne?.themes.map((theme) => theme.id)).toEqual([
      "theme-level-1-output",
      "theme-level-1-repetition",
      "theme-level-1-variables",
      "theme-level-1-input",
      "theme-level-1-conditions",
      "theme-level-1-project-prep",
      "theme-level-1-advanced-structures",
      "theme-level-1-advanced-conditions",
      "theme-level-1-conditional-loops",
    ]);
    expect(inputTheme?.chapters.map((chapter) => chapter.id)).toEqual([
      "level-1-input-imports",
      "level-1-input-buffer",
      "level-1-input-read-line",
      "level-1-input-trim",
      "level-1-input-parse",
      "level-1-input-two-lines",
      "level-1-input-text-reuse",
    ]);
    expect(inputTheme?.chapters.map((chapter) => chapter.estimatedProblemCount)).toEqual([1, 1, 1, 1, 1, 1, 1]);
    expect(levelOne?.themes[4]?.chapters.map((chapter) => chapter.id)).toEqual([
      "level-1-conditions",
      "level-1-conditions-input",
      "level-1-conditions-calculation",
    ]);
    expect(levelOne?.themes[5]?.chapters.map((chapter) => chapter.id)).toEqual([
      "level-1-project-cargo",
      "level-1-project-mod",
      "level-1-project-pub",
    ]);
    expect(levelOne?.themes[5]?.milestoneProjectId).toBe("project-level-1-core-console");
    expect(levelOne?.themes.at(-1)?.milestoneProjectId).toBe("project-level-1-watchtower-briefing");
  });

  it("restructures Level 2 around floats, arrays, strings and functions", () => {
    const curriculumLevels = getCurriculumLevels();
    const levelTwo = curriculumLevels[1];
    const levelTwoExercises = levelTwo?.themes
      .flatMap((theme) => theme.chapters)
      .flatMap((chapter) => chapter.contents)
      .filter((content) => content.type === "exercise");

    expect(levelTwo?.themes).toHaveLength(4);
    expect(levelTwo?.themes.map((theme) => theme.id)).toEqual([
      "theme-level-2-floats",
      "theme-level-2-arrays",
      "theme-level-2-strings",
      "theme-level-2-functions",
    ]);
    expect(levelTwo?.themes.at(-1)?.milestoneProjectId).toBe("project-level-2-signal-lab");
    expect(levelTwoExercises).toHaveLength(12);
  });

  it("keeps Level 3 as the algorithmic bridge before a full Level 4", () => {
    const curriculumLevels = getCurriculumLevels();
    const levelThree = curriculumLevels[2];

    expect(levelThree?.themes).toHaveLength(2);
    expect(levelThree?.themes.map((theme) => theme.id)).toEqual([
      "theme-level-3-scans",
      "theme-level-3-strings",
    ]);
  });

  it("adds a complete Level 4 with six themes and a synthesis project", () => {
    const curriculumLevels = getCurriculumLevels();
    const levelFour = curriculumLevels[3];
    const levelFourExercises = levelFour?.themes
      .flatMap((theme) => theme.chapters)
      .flatMap((chapter) => chapter.contents)
      .filter((content) => content.type === "exercise");

    expect(levelFour?.themes).toHaveLength(6);
    expect(levelFour?.themes.map((theme) => theme.id)).toEqual([
      "theme-level-4-methods",
      "theme-level-4-trees",
      "theme-level-4-scans",
      "theme-level-4-recursion",
      "theme-level-4-geometry",
      "theme-level-4-graphs",
    ]);
    expect(levelFour?.themes.at(-1)?.milestoneProjectId).toBe("project-level-4-map-explorer");
    expect(levelFourExercises).toHaveLength(12);
  });

  it("adds a complete Level 5 and a complete Level 6", () => {
    const curriculumLevels = getCurriculumLevels();
    const levelFive = curriculumLevels[4];
    const levelFiveExercises = levelFive?.themes
      .flatMap((theme) => theme.chapters)
      .flatMap((chapter) => chapter.contents)
      .filter((content) => content.type === "exercise");
    const levelSix = curriculumLevels[5];
    const levelSixExercises = levelSix?.themes
      .flatMap((theme) => theme.chapters)
      .flatMap((chapter) => chapter.contents)
      .filter((content) => content.type === "exercise");

    expect(levelFive?.themes).toHaveLength(7);
    expect(levelFive?.themes.map((theme) => theme.id)).toEqual([
      "theme-level-5-greedy",
      "theme-level-5-divide-conquer",
      "theme-level-5-binary-trees",
      "theme-level-5-efficient-sorts",
      "theme-level-5-shortest-paths",
      "theme-level-5-union-find",
      "theme-level-5-dynamic-programming",
    ]);
    expect(levelFive?.themes.at(-1)?.milestoneProjectId).toBe("project-level-5-optimizer-engine");
    expect(levelFiveExercises).toHaveLength(14);

    expect(levelSix?.id).toBe("curriculum-level-6");
    expect(levelSix?.themes).toHaveLength(7);
    expect(levelSix?.themes.map((theme) => theme.id)).toEqual([
      "theme-level-6-implicit-graphs",
      "theme-level-6-dynamic-advanced",
      "theme-level-6-scans-advanced",
      "theme-level-6-scc",
      "theme-level-6-geometry-advanced",
      "theme-level-6-flows-matchings",
      "theme-level-6-final-training",
    ]);
    expect(levelSix?.themes.at(-1)?.milestoneProjectId).toBe("project-level-6-advanced-solver");
    expect(levelSixExercises).toHaveLength(14);
  });

  it("resolves the content context for a Level 1 input exercise", () => {
    const context = getContentContextById("rust-level-12");

    expect(context?.level.id).toBe("curriculum-level-1");
    expect(context?.theme.id).toBe("theme-level-1-input");
    expect(context?.chapter.id).toBe("level-1-input-text-reuse");
    expect(context?.content.type).toBe("exercise");
  });

  it("unlocks the second curriculum level only when the first one is complete", () => {
    const curriculumLevels = getCurriculumLevels();
    const firstLevelExerciseIds = curriculumLevels[0]!.themes
      .flatMap((theme) => theme.chapters)
      .flatMap((chapter) => chapter.contents)
      .filter((content) => content.type !== "gate")
      .map((content) => content.id);

    expect(isCurriculumLevelUnlocked(curriculumLevels, ["rust-level-1"], "curriculum-level-2")).toBe(false);
    expect(isCurriculumLevelUnlocked(curriculumLevels, firstLevelExerciseIds, "curriculum-level-2")).toBe(true);
  });
});
