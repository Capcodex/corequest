import { LeitnerBox, ReviewItem } from "@/types/review";

export const MIN_LEITNER_BOX: LeitnerBox = 1;
export const MAX_LEITNER_BOX: LeitnerBox = 6;

export const REVIEW_INTERVAL_DAYS: Record<LeitnerBox, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 7,
  5: 14,
  6: 30,
};

export type ReviewItemScheduleState = Pick<
  ReviewItem,
  "failureCount" | "lastReviewedAt" | "leitnerBox" | "nextReviewAt" | "successCount"
>;

export function getNextReviewDate(box: LeitnerBox, reviewedAt: Date = new Date()): Date {
  const nextReviewDate = new Date(reviewedAt.getTime());
  nextReviewDate.setUTCDate(nextReviewDate.getUTCDate() + REVIEW_INTERVAL_DAYS[box]);
  return nextReviewDate;
}

export function promoteLeitnerBox(box: LeitnerBox): LeitnerBox {
  return Math.min(box + 1, MAX_LEITNER_BOX) as LeitnerBox;
}

export function resetLeitnerBox(): LeitnerBox {
  return MIN_LEITNER_BOX;
}

export function promoteReviewItem<TItem extends ReviewItemScheduleState>(
  item: TItem,
  reviewedAt: Date = new Date(),
): TItem {
  const nextBox = promoteLeitnerBox(item.leitnerBox);

  return {
    ...item,
    leitnerBox: nextBox,
    lastReviewedAt: reviewedAt.toISOString(),
    nextReviewAt: getNextReviewDate(nextBox, reviewedAt).toISOString(),
    successCount: item.successCount + 1,
  };
}

export function resetReviewItem<TItem extends ReviewItemScheduleState>(
  item: TItem,
  reviewedAt: Date = new Date(),
): TItem {
  const nextBox = resetLeitnerBox();

  return {
    ...item,
    leitnerBox: nextBox,
    lastReviewedAt: reviewedAt.toISOString(),
    nextReviewAt: getNextReviewDate(nextBox, reviewedAt).toISOString(),
    failureCount: item.failureCount + 1,
  };
}
