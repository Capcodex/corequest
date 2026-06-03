"use client";

import { useEffect } from "react";
import { AnalyticsEventName } from "@/types/analytics";
import { trackClientEvent } from "@/lib/analytics/client";

type TrackEventOnMountProps = {
  eventName: AnalyticsEventName;
  properties?: Record<string, string | number | boolean | null>;
};

export function TrackEventOnMount({
  eventName,
  properties,
}: TrackEventOnMountProps) {
  useEffect(() => {
    trackClientEvent({
      name: eventName,
      properties,
    });
  }, [eventName, properties]);

  return null;
}

