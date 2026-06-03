import { Level } from "@/types/level";

export function shouldGrantXp(completedLevelIds: string[], levelId: string) {
  return !completedLevelIds.includes(levelId);
}

export function getNextLevelId(levels: Level[], levelId: string) {
  const levelIndex = levels.findIndex((level) => level.id === levelId);

  if (levelIndex === -1) {
    return null;
  }

  return levels[levelIndex + 1]?.id ?? null;
}

export function isLevelUnlocked(
  levels: Level[],
  completedLevelIds: string[],
  levelId: string,
) {
  const levelIndex = levels.findIndex((level) => level.id === levelId);

  if (levelIndex === -1) {
    return false;
  }

  if (levelIndex === 0) {
    return true;
  }

  const previousLevelId = levels[levelIndex - 1]?.id;
  return previousLevelId ? completedLevelIds.includes(previousLevelId) : false;
}

