import { NextResponse } from "next/server";
import { getExerciseEntries } from "@/lib/content/getCurriculum";
import { getDailyReviewSession } from "@/lib/review/getDailyReviewSession";
import { getAuthenticatedReviewUserId } from "@/lib/review/reviewApi";
import { createClient } from "@/lib/supabase/server";

type CompletedExerciseRow = {
  level_id: string;
};

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "DEV_ONLY" }, { status: 403 });
  }

  const supabase = await createClient();
  const userId = await getAuthenticatedReviewUserId(supabase);

  if (!userId) {
    return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  }

  const { data: completions, error: completionsError } = await supabase
    .from("level_completions")
    .select("level_id")
    .eq("user_id", userId);

  if (completionsError) {
    return NextResponse.json({ error: completionsError.message }, { status: 400 });
  }

  const exerciseIds = new Set(getExerciseEntries().map((exercise) => exercise.id));
  const completedExerciseIds = [...new Set(((completions ?? []) as CompletedExerciseRow[])
    .map((completion) => completion.level_id)
    .filter((contentId) => exerciseIds.has(contentId)))];

  if (completedExerciseIds.length === 0) {
    return NextResponse.json({
      createdOrUpdated: 0,
      completedExerciseCount: 0,
      dueCount: 0,
    });
  }

  const now = new Date().toISOString();
  const rows = completedExerciseIds.map((contentId) => ({
    user_id: userId,
    content_id: contentId,
    content_type: "exercise",
    leitner_box: 1,
    next_review_at: now,
  }));

  const { error: upsertError } = await supabase
    .from("review_items")
    .upsert(rows, {
      onConflict: "user_id,content_id",
    });

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 400 });
  }

  const session = await getDailyReviewSession(userId, {
    supabase,
  });

  return NextResponse.json(
    {
      createdOrUpdated: rows.length,
      completedExerciseCount: completedExerciseIds.length,
      dueCount: session.dueCount,
      items: session.items.map((item) => item.exercise.id),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
