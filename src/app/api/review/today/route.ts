import { NextRequest, NextResponse } from "next/server";
import { getDailyReviewSession } from "@/lib/review/getDailyReviewSession";
import { getAuthenticatedReviewUserId, parseDailyReviewLimit } from "@/lib/review/reviewApi";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const userId = await getAuthenticatedReviewUserId(supabase);

  if (!userId) {
    return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  }

  try {
    const limit = parseDailyReviewLimit(request.nextUrl.searchParams.get("limit"));
    const session = await getDailyReviewSession(userId, {
      limit,
      supabase,
    });

    return NextResponse.json(session, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Review today API error:", error);
    return NextResponse.json({ error: "REVIEW_SESSION_UNAVAILABLE" }, { status: 500 });
  }
}
