import { createClient } from "@/lib/supabase/server";
import { getContentContextById } from "@/lib/content/getCurriculum";
import { getLevels } from "@/lib/levels/getLevels";
import { getCrabProgress } from "@/lib/progress/crabProgress";
import {
  UserProgress,
  UserProgressRow,
  UserProgressSummary,
} from "@/types/progress";

export async function getUserProgress(userId: string): Promise<UserProgressSummary> {
  const supabase = await createClient();

  const [{ data: progressRow }, { data: completions }, { data: projectCompletions }, { data: profile }] =
    await Promise.all([
    supabase
      .from("user_progress")
      .select("user_id, current_level_id, xp_total")
      .eq("user_id", userId)
      .maybeSingle<UserProgressRow>(),
    supabase
      .from("level_completions")
      .select("level_id")
      .eq("user_id", userId),
    supabase
      .from("project_completions")
      .select("project_id")
      .eq("user_id", userId),
    supabase
      .from("profiles")
      .select("display_name, email")
      .eq("id", userId)
      .maybeSingle<{ display_name: string | null; email: string }>(),
  ]);

  const levels = getLevels();
  const firstLevelId = levels[0]?.id ?? "rust-level-1";
  const completedLevelIds = (completions ?? []).map((completion) => completion.level_id);
  const completedProjectIds = (projectCompletions ?? []).map((completion) => completion.project_id);
  const currentContentId = progressRow?.current_level_id ?? firstLevelId;
  const currentContext = getContentContextById(currentContentId);
  const xpTotal = progressRow?.xp_total ?? 0;

  const baseProgress: UserProgress = {
    userId,
    currentLevelId: currentContentId,
    completedLevelIds,
    xpTotal,
    currentContentId,
    completedContentIds: completedLevelIds,
    currentCurriculumLevelId: currentContext?.level.id ?? null,
    currentCurriculumLevelNumber: currentContext?.level.levelNumber ?? null,
    currentThemeId: currentContext?.theme.id ?? null,
    currentChapterId: currentContext?.chapter.id ?? null,
    completedProjectIds,
  };

  return {
    ...baseProgress,
    crabProgress: getCrabProgress(xpTotal),
    displayName: profile?.display_name ?? null,
    email: profile?.email ?? null,
  };
}
