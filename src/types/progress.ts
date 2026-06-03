export type LevelProgressState = "locked" | "available" | "in_progress" | "completed";

export type UserProgress = {
  userId: string;
  currentLevelId: string;
  completedLevelIds: string[];
  xpTotal: number;
};

export type UserProgressRow = {
  user_id: string;
  current_level_id: string;
  xp_total: number;
};

export type UserProgressSummary = UserProgress & {
  displayName: string | null;
  email: string | null;
};

export type CompleteLevelResult = {
  completedLevelId: string;
  nextLevelId: string | null;
  xpGranted: boolean;
  xpTotal: number;
};
