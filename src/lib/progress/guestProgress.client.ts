"use client";

const PENDING_COMPLETION_STORAGE_KEY = "corequest-pending-level-completion";

type PendingLevelCompletion = {
  levelId: string;
  nextPath: string | null;
};

export function savePendingLevelCompletion(pendingCompletion: PendingLevelCompletion) {
  window.localStorage.setItem(
    PENDING_COMPLETION_STORAGE_KEY,
    JSON.stringify(pendingCompletion),
  );
}

export function getPendingLevelCompletion(): PendingLevelCompletion | null {
  const rawValue = window.localStorage.getItem(PENDING_COMPLETION_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as PendingLevelCompletion;
  } catch {
    window.localStorage.removeItem(PENDING_COMPLETION_STORAGE_KEY);
    return null;
  }
}

export function clearPendingLevelCompletion() {
  window.localStorage.removeItem(PENDING_COMPLETION_STORAGE_KEY);
}

export async function syncPendingLevelCompletion() {
  const pendingCompletion = getPendingLevelCompletion();

  if (!pendingCompletion) {
    return null;
  }

  const response = await fetch("/api/progress/complete-level", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ levelId: pendingCompletion.levelId }),
  });

  const data = (await response.json()) as { error?: string };

  if (!response.ok || data.error) {
    throw new Error(data.error ?? "PENDING_COMPLETION_SYNC_FAILED");
  }

  clearPendingLevelCompletion();
  return pendingCompletion;
}
