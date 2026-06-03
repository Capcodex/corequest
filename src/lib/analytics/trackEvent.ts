import { createClient } from "@/lib/supabase/server";
import { AnalyticsEventName } from "@/types/analytics";

type TrackEventInput = {
  anonymousSessionId?: string | null;
  eventName: AnalyticsEventName;
  properties?: Record<string, string | number | boolean | null>;
};

export async function trackEvent({
  anonymousSessionId = null,
  eventName,
  properties = {},
}: TrackEventInput) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("analytics_events").insert({
      user_id: user?.id ?? null,
      anonymous_session_id: anonymousSessionId,
      event_name: eventName,
      properties,
    });
  } catch (error) {
    console.error("Analytics insert error:", error);
  }
}

