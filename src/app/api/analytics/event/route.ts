import { NextRequest, NextResponse } from "next/server";
import { AnalyticsEventPayload } from "@/types/analytics";
import { trackEvent } from "@/lib/analytics/trackEvent";

export async function POST(request: NextRequest) {
  let payload: AnalyticsEventPayload;

  try {
    payload = (await request.json()) as AnalyticsEventPayload;
  } catch {
    return NextResponse.json({ error: "Payload JSON invalide." }, { status: 400 });
  }

  if (!payload.name) {
    return NextResponse.json({ error: "Le nom d’événement est obligatoire." }, { status: 400 });
  }

  await trackEvent({
    anonymousSessionId: payload.anonymousSessionId,
    eventName: payload.name,
    properties: payload.properties,
  });

  return NextResponse.json({ ok: true });
}

