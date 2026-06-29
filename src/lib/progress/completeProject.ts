import { getProjectById } from "@/lib/content/getProjects";
import { getCurriculumRoadmap } from "@/lib/progress/getCurriculumRoadmap";
import { getCrabProgress } from "@/lib/progress/crabProgress";
import { getUserProgress } from "@/lib/progress/getUserProgress";
import { createClient } from "@/lib/supabase/server";
import { CompleteProjectResult, UserProgressSummary } from "@/types/progress";

const RPC_MISSING_CODES = new Set(["PGRST202", "42883"]);
const DUPLICATE_KEY_CODE = "23505";

type PersistProjectCompletionInput = {
  progress: UserProgressSummary;
  projectId: string;
  userId: string;
  xpAward: number;
};

type PersistProjectCompletionResult = {
  xpGranted: boolean;
  xpTotal: number;
};

export async function completeProject(userId: string, projectId: string): Promise<CompleteProjectResult> {
  const project = getProjectById(projectId);

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const progress = await getUserProgress(userId);
  const roadmap = getCurriculumRoadmap(progress);
  const roadmapProject = roadmap.levels
    .flatMap((level) => level.items)
    .find((item) => item.type === "project" && item.id === projectId);

  if (!roadmapProject || roadmapProject.status === "locked") {
    throw new Error("PROJECT_LOCKED");
  }

  const supabase = await createClient();
  const persistedResult = await persistProjectCompletion(supabase, {
    progress,
    projectId,
    userId,
    xpAward: project.xpReward,
  });
  const previousCrabProgress = getCrabProgress(progress.xpTotal);
  const crabProgress = getCrabProgress(persistedResult.xpTotal);

  return {
    completedProjectId: projectId,
    xpGranted: persistedResult.xpGranted,
    xpAward: project.xpReward,
    xpTotal: persistedResult.xpTotal,
    crabProgress,
    leveledUp: crabProgress.level > previousCrabProgress.level,
  };
}

async function persistProjectCompletion(
  supabase: Awaited<ReturnType<typeof createClient>>,
  input: PersistProjectCompletionInput,
): Promise<PersistProjectCompletionResult> {
  const { data, error } = await supabase.rpc("complete_project", {
    p_project_id: input.projectId,
    p_xp_award: input.xpAward,
  });

  if (error) {
    if (!shouldFallbackToDirectWrites(error)) {
      throw error;
    }

    console.warn("Falling back to direct project completion writes:", error.message);
    return persistProjectCompletionWithDirectWrites(supabase, input);
  }

  return {
    xpGranted: Boolean(data?.xpGranted),
    xpTotal: Number(data?.xpTotal ?? input.progress.xpTotal),
  };
}

async function persistProjectCompletionWithDirectWrites(
  supabase: Awaited<ReturnType<typeof createClient>>,
  input: PersistProjectCompletionInput,
): Promise<PersistProjectCompletionResult> {
  let xpGranted = !input.progress.completedProjectIds?.includes(input.projectId);

  if (xpGranted) {
    const { error: completionError } = await supabase.from("project_completions").insert({
      user_id: input.userId,
      project_id: input.projectId,
      xp_awarded: input.xpAward,
    });

    if (completionError) {
      if (!isDuplicateKeyError(completionError)) {
        throw completionError;
      }

      xpGranted = false;
    }
  }

  const xpTotal = input.progress.xpTotal + (xpGranted ? input.xpAward : 0);
  const { error: progressError } = await supabase.from("user_progress").upsert(
    {
      user_id: input.userId,
      current_level_id: input.progress.currentLevelId,
      xp_total: xpTotal,
    },
    {
      onConflict: "user_id",
    },
  );

  if (progressError) {
    throw progressError;
  }

  return {
    xpGranted,
    xpTotal,
  };
}

function shouldFallbackToDirectWrites(error: { code?: string | null; message?: string | null }) {
  if (error.code && RPC_MISSING_CODES.has(error.code)) {
    return true;
  }

  return String(error.message ?? "").includes("complete_project");
}

function isDuplicateKeyError(error: { code?: string | null }) {
  return error.code === DUPLICATE_KEY_CODE;
}
