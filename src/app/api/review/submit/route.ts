import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedReviewUserId,
  getSubmitReviewErrorStatus,
  parseSubmitReviewPayload,
} from "@/lib/review/reviewApi";
import { submitReviewAttempt } from "@/lib/review/submitReviewAttempt";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  let rawPayload: unknown;

  try {
    rawPayload = await request.json();
  } catch {
    return NextResponse.json({ error: "REVIEW_PAYLOAD_INVALID" }, { status: 400 });
  }

  const payload = parseSubmitReviewPayload(rawPayload);

  if (!payload) {
    return NextResponse.json({ error: "REVIEW_PAYLOAD_INVALID" }, { status: 400 });
  }

  const supabase = await createClient();
  const userId = await getAuthenticatedReviewUserId(supabase);

  if (!userId) {
    return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  }

  try {
    const result = await submitReviewAttempt(userId, payload, {
      supabase,
    });

    revalidatePath("/review");
    revalidatePath("/dashboard");

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
    return NextResponse.json({ error: message }, { status: getSubmitReviewErrorStatus(error) });
  }
}
