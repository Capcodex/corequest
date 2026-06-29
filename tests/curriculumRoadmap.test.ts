import { getExerciseEntries } from "@/lib/content/getCurriculum";
import { getCurriculumRoadmap } from "@/lib/progress/getCurriculumRoadmap";
import { getCrabProgress } from "@/lib/progress/crabProgress";
import { UserProgressSummary } from "@/types/progress";
import { describe, expect, it } from "vitest";

const orderedExerciseIds = getExerciseEntries().map((exercise) => exercise.id);

function completedExerciseIds(count: number): string[] {
  return orderedExerciseIds.slice(0, count);
}

function completedBefore(targetId: string): string[] {
  const index = orderedExerciseIds.indexOf(targetId);
  if (index === -1) {
    throw new Error(`Unknown exercise id: ${targetId}`);
  }
  return orderedExerciseIds.slice(0, index);
}

function completedThrough(targetId: string): string[] {
  const index = orderedExerciseIds.indexOf(targetId);
  if (index === -1) {
    throw new Error(`Unknown exercise id: ${targetId}`);
  }
  return orderedExerciseIds.slice(0, index + 1);
}

function buildProgress(overrides: Partial<UserProgressSummary> = {}): UserProgressSummary {
  const xpTotal = overrides.xpTotal ?? 0;

  return {
    userId: "user-1",
    currentLevelId: "rust-level-1",
    completedLevelIds: [],
    xpTotal,
    currentContentId: "rust-level-1",
    completedContentIds: [],
    currentCurriculumLevelId: "curriculum-level-1",
    currentCurriculumLevelNumber: 1,
    currentThemeId: "theme-level-1-output",
    currentChapterId: "level-1-output-and-sequences",
    completedProjectIds: [],
    displayName: null,
    email: null,
    ...overrides,
    crabProgress: overrides.crabProgress ?? getCrabProgress(overrides.xpTotal ?? xpTotal),
  };
}

describe("getCurriculumRoadmap", () => {
  it("expose le premier chapitre comme point de reprise et garde le projet verrouill? au d?part", () => {
    const roadmap = getCurriculumRoadmap(buildProgress());

    expect(roadmap.currentChapter?.id).toBe("level-1-output-and-sequences");
    expect(roadmap.levels[0]?.status).toBe("in_progress");
    expect(roadmap.levels[0]?.items[0]?.type).toBe("chapter");
    expect(roadmap.currentChapter?.exercises[0]).toMatchObject({
      id: "rust-level-1",
      href: "/levels/rust-level-1",
      status: "in_progress",
    });
    expect(roadmap.levels[1]?.status).toBe("locked");
    expect(roadmap.nextProject?.id).toBe("project-level-1-core-console");
    expect(roadmap.nextProject?.status).toBe("locked");
  });

  it("bascule vers le Niveau 2 tout en gardant le second projet pilote disponible", () => {
    const completedLevelIds = completedBefore("rust-level-16");
    const roadmap = getCurriculumRoadmap(
      buildProgress({
        currentLevelId: "rust-level-16",
        currentContentId: "rust-level-16",
        completedLevelIds,
        completedContentIds: completedLevelIds,
        completedProjectIds: ["project-level-1-core-console"],
        currentCurriculumLevelId: "curriculum-level-2",
        currentCurriculumLevelNumber: 2,
        currentThemeId: "theme-level-2-floats",
        currentChapterId: "level-2-floats-and-tools",
        xpTotal: 825,
      }),
    );

    expect(roadmap.levels[0]?.status).toBe("completed");
    expect(roadmap.currentChapter?.id).toBe("level-2-floats-and-tools");
    expect(roadmap.nextProject?.id).toBe("project-level-1-watchtower-briefing");
    expect(roadmap.nextProject?.status).toBe("available");
    expect(roadmap.availableProjectCount).toBe(1);
    expect(roadmap.recommendedAction.kind).toBe("exercise");
  });

  it("déverrouille la suite du Niveau 1 seulement après le premier projet pilote", () => {
    const completedLevelIds = completedThrough("rust-level-15-project-pub");
    const roadmap = getCurriculumRoadmap(
      buildProgress({
        currentLevelId: "rust-level-15-project-pub",
        currentContentId: "rust-level-15-project-pub",
        completedLevelIds,
        completedContentIds: completedLevelIds,
        currentCurriculumLevelId: "curriculum-level-1",
        currentCurriculumLevelNumber: 1,
        currentThemeId: "theme-level-1-project-prep",
        currentChapterId: "level-1-project-pub",
        xpTotal: 760,
      }),
    );

    expect(roadmap.levels[0]?.status).toBe("in_progress");
    expect(roadmap.nextProject?.id).toBe("project-level-1-core-console");
    expect(roadmap.nextProject?.status).toBe("available");
    expect(roadmap.availableProjectCount).toBe(1);
  });


  it("garde le Niveau 3 verrouill? tant que tout le Niveau 2 n'est pas valid?", () => {
    const completedLevelIds = completedBefore("rust-level-27");
    const roadmap = getCurriculumRoadmap(
      buildProgress({
        currentLevelId: "rust-level-27",
        currentContentId: "rust-level-27",
        completedLevelIds,
        completedContentIds: completedLevelIds,
        completedProjectIds: ["project-level-1-core-console"],
        currentCurriculumLevelId: "curriculum-level-2",
        currentCurriculumLevelNumber: 2,
        currentThemeId: "theme-level-2-functions",
        currentChapterId: "level-2-functions",
        xpTotal: 1825,
      }),
    );

    expect(roadmap.levels[1]?.status).toBe("in_progress");
    expect(roadmap.levels[2]?.status).toBe("locked");
    expect(roadmap.nextProject?.id).toBe("project-level-1-watchtower-briefing");
    expect(roadmap.nextProject?.status).toBe("available");
    expect(roadmap.availableProjectCount).toBe(1);
  });

  it("fait remonter le projet de niveau 2 quand il devient le jalon disponible le plus avanc?", () => {
    const completedLevelIds = completedBefore("rust-level-28");
    const roadmap = getCurriculumRoadmap(
      buildProgress({
        currentLevelId: "rust-level-28",
        currentContentId: "rust-level-28",
        completedLevelIds,
        completedContentIds: completedLevelIds,
        completedProjectIds: ["project-level-1-core-console"],
        currentCurriculumLevelId: "curriculum-level-3",
        currentCurriculumLevelNumber: 3,
        currentThemeId: "theme-level-3-scans",
        currentChapterId: "level-3-scans-and-complexity",
        xpTotal: 1900,
      }),
    );

    expect(roadmap.levels[1]?.status).toBe("completed");
    expect(roadmap.currentChapter?.id).toBe("level-3-scans-and-complexity");
    expect(roadmap.nextProject?.id).toBe("project-level-2-signal-lab");
    expect(roadmap.nextProject?.status).toBe("available");
    expect(roadmap.availableProjectCount).toBe(2);
  });

  it("ouvre le projet de niveau 5 et le Niveau 6 une fois tout le Niveau 5 validé", () => {
    const completedLevelIds = completedBefore("rust-level-58");
    const roadmap = getCurriculumRoadmap(
      buildProgress({
        currentLevelId: "rust-level-58",
        currentContentId: "rust-level-58",
        completedLevelIds,
        completedContentIds: completedLevelIds,
        currentCurriculumLevelId: "curriculum-level-6",
        currentCurriculumLevelNumber: 6,
        currentThemeId: "theme-level-6-implicit-graphs",
        currentChapterId: "level-6-implicit-graphs",
        xpTotal: 4200,
      }),
    );

    expect(roadmap.levels[4]?.status).toBe("completed");
    expect(roadmap.levels[5]?.status).toBe("in_progress");
    expect(roadmap.nextProject?.id).toBe("project-level-5-optimizer-engine");
    expect(roadmap.nextProject?.status).toBe("available");
    expect(roadmap.availableProjectCount).toBeGreaterThanOrEqual(4);
  });


  it("fait remonter le projet final une fois tout le Niveau 6 validé", () => {
    const completedLevelIds = completedThrough("rust-level-71");
    const roadmap = getCurriculumRoadmap(
      buildProgress({
        currentLevelId: "rust-level-71",
        currentContentId: "rust-level-71",
        completedLevelIds,
        completedContentIds: completedLevelIds,
        currentCurriculumLevelId: "curriculum-level-6",
        currentCurriculumLevelNumber: 6,
        currentThemeId: "theme-level-6-final-training",
        currentChapterId: "level-6-final-training",
        xpTotal: 5600,
      }),
    );

    expect(roadmap.levels[5]?.status).toBe("completed");
    expect(roadmap.nextProject?.id).toBe("project-level-6-advanced-solver");
    expect(roadmap.nextProject?.status).toBe("available");
    expect(roadmap.availableProjectCount).toBeGreaterThanOrEqual(5);
  });

});
