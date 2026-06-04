export type LevelProgressState = "locked" | "available" | "in_progress" | "completed";

export type UserProgress = {
  userId: string;
  currentLevelId: string;
  completedLevelIds: string[];
  xpTotal: number;
};

export type CrabProgress = {
  level: number;
  title: string;
  currentLevelMinXp: number;
  nextLevel: number | null;
  nextLevelMinXp: number | null;
  xpIntoLevel: number;
  xpRemainingToNextLevel: number;
  progressPercentage: number;
  isMaxLevel: boolean;
};

export type UserProgressWithCrab = UserProgress & {
  crabProgress: CrabProgress;
};

export type UserProgressRow = {
  user_id: string;
  current_level_id: string;
  xp_total: number;
};

export type UserProgressSummary = UserProgressWithCrab & {
  displayName: string | null;
  email: string | null;
};

export type CompleteLevelResult = {
  completedLevelId: string;
  currentLevelId: string;
  nextLevelId: string | null;
  xpGranted: boolean;
  xpTotal: number;
  crabProgress: CrabProgress;
  leveledUp: boolean;
};
