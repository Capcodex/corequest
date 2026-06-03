import { createClient } from "@/lib/supabase/server";
import { getLevels } from "@/lib/levels/getLevels";
import {
  UserProgress,
  UserProgressRow,
  UserProgressSummary,
} from "@/types/progress";

export async function getUserProgress(userId: string): Promise<UserProgressSummary> {
  const supabase = await createClient();

  const [{ data: progressRow }, { data: completions }, { data: profile }] = await Promise.all([
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
      .from("profiles")
      .select("display_name, email")
      .eq("id", userId)
      .maybeSingle<{ display_name: string | null; email: string }>(),
  ]);

  const levels = getLevels();
  const firstLevelId = levels[0]?.id ?? "rust-level-1";
  const completedLevelIds = (completions ?? []).map((completion) => completion.level_id);

  const baseProgress: UserProgress = {
    userId,
    currentLevelId: progressRow?.current_level_id ?? firstLevelId,
    completedLevelIds,
    xpTotal: progressRow?.xp_total ?? 0,
  };

  return {
    ...baseProgress,
    displayName: profile?.display_name ?? null,
    email: profile?.email ?? null,
  };
}

