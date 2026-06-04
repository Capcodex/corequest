import { getLevelById } from "@/lib/levels/getLevelById";
import { getLevels } from "@/lib/levels/getLevels";
import { getCrabProgress } from "@/lib/progress/crabProgress";
import { buildCompletionState } from "@/lib/progress/completionState";
import { getUserProgress } from "@/lib/progress/getUserProgress";
import { getNextLevelId, isLevelUnlocked, shouldGrantXp } from "@/lib/progress/progressRules";
import { createClient } from "@/lib/supabase/server";
import { CompleteLevelResult, UserProgressSummary } from "@/types/progress";

const RPC_MISSING_CODES = new Set(["PGRST202", "42883"]);
const DUPLICATE_KEY_CODE = "23505";

type PersistCompletionInput = {
  currentLevelId: string;
  levelId: string;
  nextLevelId: string | null;
  progress: UserProgressSummary;
  userId: string;
  xpAward: number;
};

type PersistCompletionResult = {
  currentLevelId: string;
  xpGranted: boolean;
  xpTotal: number;
};

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
  const nextLevelToUnlock = progress.currentLevelId === levelId ? nextLevelId : null;
  const supabase = await createClient();
  const persistedResult = await persistCompletion(supabase, {
    currentLevelId: progress.currentLevelId,
    levelId,
    nextLevelId: nextLevelToUnlock,
    progress,
    userId,
    xpAward: level.xpReward,
  });
  const previousCrabProgress = getCrabProgress(progress.xpTotal);
  const crabProgress = getCrabProgress(persistedResult.xpTotal);

  return {
    completedLevelId: levelId,
    currentLevelId: persistedResult.currentLevelId,
    nextLevelId,
    xpGranted: persistedResult.xpGranted,
    xpTotal: persistedResult.xpTotal,
    crabProgress,
    leveledUp: crabProgress.level > previousCrabProgress.level,
  };
}

async function persistCompletion(
  supabase: Awaited<ReturnType<typeof createClient>>,
  input: PersistCompletionInput,
): Promise<PersistCompletionResult> {
  const { data, error } = await supabase.rpc("complete_level", {
    p_level_id: input.levelId,
    p_xp_award: input.xpAward,
    p_next_level_id: input.nextLevelId,
  });

  if (error) {
    if (!shouldFallbackToDirectWrites(error)) {
      throw error;
    }

    console.warn("Falling back to direct level completion writes:", error.message);
    return persistCompletionWithDirectWrites(supabase, input);
  }

  const xpGranted = Boolean(data?.xpGranted);
  const xpTotal = Number(data?.xpTotal ?? input.progress.xpTotal);
  const nextState = buildCompletionState({
    currentLevelId: input.currentLevelId,
    levelId: input.levelId,
    nextLevelId: input.nextLevelId,
    xpAward: input.xpAward,
    xpGranted,
    xpTotal: input.progress.xpTotal,
  });

  return {
    currentLevelId: nextState.currentLevelId,
    xpGranted,
    xpTotal,
  };
}

async function persistCompletionWithDirectWrites(
  supabase: Awaited<ReturnType<typeof createClient>>,
  input: PersistCompletionInput,
): Promise<PersistCompletionResult> {
  let xpGranted = shouldGrantXp(input.progress.completedLevelIds, input.levelId);

  if (xpGranted) {
    const { error: completionError } = await supabase.from("level_completions").insert({
      user_id: input.userId,
      level_id: input.levelId,
      xp_awarded: input.xpAward,
    });

    if (completionError) {
      if (!isDuplicateKeyError(completionError)) {
        throw completionError;
      }

      xpGranted = false;
    }
  }

  const nextState = buildCompletionState({
    currentLevelId: input.currentLevelId,
    levelId: input.levelId,
    nextLevelId: input.nextLevelId,
    xpAward: input.xpAward,
    xpGranted,
    xpTotal: input.progress.xpTotal,
  });

  const { error: progressError } = await supabase.from("user_progress").upsert(
    {
      user_id: input.userId,
      current_level_id: nextState.currentLevelId,
      xp_total: nextState.xpTotal,
    },
    {
      onConflict: "user_id",
    },
  );

  if (progressError) {
    throw progressError;
  }

  return {
    currentLevelId: nextState.currentLevelId,
    xpGranted,
    xpTotal: nextState.xpTotal,
  };
}

function shouldFallbackToDirectWrites(error: { code?: string | null; message?: string | null }) {
  if (error.code && RPC_MISSING_CODES.has(error.code)) {
    return true;
  }

  return String(error.message ?? "").includes("complete_level");
}

function isDuplicateKeyError(error: { code?: string | null }) {
  return error.code === DUPLICATE_KEY_CODE;
}
