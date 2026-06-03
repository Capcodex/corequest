import { getLevelById } from "@/lib/levels/getLevelById";
import { getLevels } from "@/lib/levels/getLevels";
import { getNextLevelId, isLevelUnlocked, shouldGrantXp } from "@/lib/progress/progressRules";
import { getUserProgress } from "@/lib/progress/getUserProgress";
import { createClient } from "@/lib/supabase/server";
import { CompleteLevelResult } from "@/types/progress";

export async function completeLevel(userId: string, levelId: string): Promise<CompleteLevelResult> {
  const level = getLevelById(levelId);

  if (!level) {
    throw new Error("LEVEL_NOT_FOUND");
  }

  const progress = await getUserProgress(userId);
  const levels = getLevels();
  if (!isLevelUnlocked(levels, progress.completedLevelIds, levelId)) {
    throw new Error("LEVEL_LOCKED");
  }

  const nextLevelId = getNextLevelId(levels, levelId);
  const alreadyCompleted = !shouldGrantXp(progress.completedLevelIds, levelId);
  const nextLevelToUnlock =
    !alreadyCompleted && progress.currentLevelId === levelId ? nextLevelId : null;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("complete_level", {
    p_level_id: levelId,
    p_xp_award: level.xpReward,
    p_next_level_id: nextLevelToUnlock,
  });

  if (error) {
    throw error;
  }

  const result = data as {
    xpGranted: boolean;
    xpTotal: number;
  };

  return {
    completedLevelId: levelId,
    nextLevelId,
    xpGranted: Boolean(result?.xpGranted),
    xpTotal: Number(result?.xpTotal ?? progress.xpTotal),
  };
}
