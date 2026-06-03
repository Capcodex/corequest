import { Level } from "@/types/level";
import { LevelProgressState, UserProgress } from "@/types/progress";

export function getLevelState(
  level: Level,
  progress: UserProgress,
  previousLevelId?: string,
): LevelProgressState {
  if (progress.completedLevelIds.includes(level.id)) {
    return "completed";
  }

  if (progress.currentLevelId === level.id) {
    return "in_progress";
  }

  if (level.orderIndex === 1) {
    return "available";
  }

  if (previousLevelId && progress.completedLevelIds.includes(previousLevelId)) {
    return "available";
  }

  return "locked";
}
