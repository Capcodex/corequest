import { CrabProgress } from "@/types/progress";

type CrabMilestone = {
  level: number;
  minXp: number;
  title: string;
};

export const CRAB_LEVEL_MILESTONES: CrabMilestone[] = [
  { level: 1, minXp: 0, title: "Moussaillon" },
  { level: 2, minXp: 75, title: "Éclaireur" },
  { level: 3, minXp: 195, title: "Pisteur" },
  { level: 4, minXp: 360, title: "Navigateur" },
  { level: 5, minXp: 570, title: "Technicien" },
  { level: 6, minXp: 825, title: "Stratège" },
  { level: 7, minXp: 1125, title: "Gardien" },
  { level: 8, minXp: 1350, title: "Légende" },
];

export function getCrabProgress(xpTotal: number): CrabProgress {
  const normalizedXp = Math.max(0, Math.floor(xpTotal));
  const currentIndex = findCurrentMilestoneIndex(normalizedXp);
  const currentMilestone = CRAB_LEVEL_MILESTONES[currentIndex];
  const nextMilestone = CRAB_LEVEL_MILESTONES[currentIndex + 1] ?? null;
  const xpIntoLevel = normalizedXp - currentMilestone.minXp;
  const xpRemainingToNextLevel = nextMilestone ? Math.max(0, nextMilestone.minXp - normalizedXp) : 0;
  const progressPercentage = nextMilestone
    ? Math.min(
        100,
        Math.round((xpIntoLevel / (nextMilestone.minXp - currentMilestone.minXp)) * 100),
      )
    : 100;

  return {
    level: currentMilestone.level,
    title: currentMilestone.title,
    currentLevelMinXp: currentMilestone.minXp,
    nextLevel: nextMilestone?.level ?? null,
    nextLevelMinXp: nextMilestone?.minXp ?? null,
    xpIntoLevel,
    xpRemainingToNextLevel,
    progressPercentage,
    isMaxLevel: nextMilestone === null,
  };
}

function findCurrentMilestoneIndex(xpTotal: number) {
  for (let index = CRAB_LEVEL_MILESTONES.length - 1; index >= 0; index -= 1) {
    if (xpTotal >= CRAB_LEVEL_MILESTONES[index].minXp) {
      return index;
    }
  }

  return 0;
}
