import { NextRequest, NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { savePremiumInterest } from "@/lib/premium/savePremiumInterest";

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => ({}))) as {
    anonymousSessionId?: string | null;
    email?: string | null;
  };

  try {
    const result = await savePremiumInterest({
      email: payload.email,
    });

    await trackEvent({
      anonymousSessionId: payload.anonymousSessionId ?? null,
      eventName: "premium_interest_clicked",
      properties: {
        hasEmail: Boolean(result.email),
        isAuthenticated: Boolean(result.userId),
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Votre intérêt a bien été enregistré.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "PREMIUM_INTEREST_SAVE_FAILED";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

