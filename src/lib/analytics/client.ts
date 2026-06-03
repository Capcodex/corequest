"use client";

import { AnalyticsEventPayload } from "@/types/analytics";

const SESSION_STORAGE_KEY = "corequest-anonymous-session-id";

export function getAnonymousSessionId() {
  const existingValue = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (existingValue) {
    return existingValue;
  }

  const newValue = crypto.randomUUID();
  window.localStorage.setItem(SESSION_STORAGE_KEY, newValue);
  return newValue;
}

export async function trackClientEvent(payload: AnalyticsEventPayload) {
  const body = JSON.stringify({
    ...payload,
    anonymousSessionId: payload.anonymousSessionId ?? getAnonymousSessionId(),
  });

  if (navigator.sendBeacon) {
    const success = navigator.sendBeacon(
      "/api/analytics/event",
      new Blob([body], { type: "application/json" }),
    );

    if (success) {
      return;
    }
  }

  void fetch("/api/analytics/event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    keepalive: true,
  });
}

