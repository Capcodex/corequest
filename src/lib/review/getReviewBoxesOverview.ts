import { getContentContextById } from "@/lib/content/getCurriculum";
import { createClient } from "@/lib/supabase/server";
import {
  LeitnerBox,
  ReviewBoxesOverview,
  ReviewBoxOverview,
  ReviewBoxOverviewItem,
} from "@/types/review";
import { mapReviewItemRow, ReviewItemRow } from "@/lib/review/getDailyReviewSession";

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const LEITNER_BOXES: LeitnerBox[] = [1, 2, 3, 4, 5, 6];

const BOX_COPY: Record<LeitnerBox, { label: string; description: string }> = {
  1: {
    label: "Box 1",
    description: "Rappels rapprochés pour stabiliser les bases.",
  },
  2: {
    label: "Box 2",
    description: "Notions récentes à confirmer rapidement.",
  },
  3: {
    label: "Box 3",
    description: "Consolidation intermédiaire.",
  },
  4: {
    label: "Box 4",
    description: "Rappels espacés pour vérifier la rétention.",
  },
  5: {
    label: "Box 5",
    description: "Notions solides à entretenir ponctuellement.",
  },
  6: {
    label: "Box 6",
    description: "Mémoire longue, fréquence minimale.",
  },
};

type ReviewClientError = {
  code?: string | null;
  message?: string | null;
};

type QueryResponse<TData> = {
  data: TData[] | null;
  error: ReviewClientError | null;
};

type QueryBuilder<TData> = PromiseLike<QueryResponse<TData>> & {
  eq: (column: string, value: unknown) => QueryBuilder<TData>;
  in: (column: string, values: unknown[]) => QueryBuilder<TData>;
  order: (column: string, options: { ascending: boolean }) => QueryBuilder<TData>;
};

type ReviewBoxesClient = {
  from: <TData>(table: string) => {
    select: (columns: string) => QueryBuilder<TData>;
  };
};

type CompletionRow = {
  level_id: string;
};

type GetReviewBoxesOverviewOptions = {
  now?: Date;
  supabase?: unknown;
};

export async function getReviewBoxesOverview(
  userId: string,
  options: GetReviewBoxesOverviewOptions = {},
): Promise<ReviewBoxesOverview> {
  const supabase = options.supabase
    ? (options.supabase as ReviewBoxesClient)
    : ((await createClient()) as unknown as ReviewBoxesClient);
  const now = options.now ?? new Date();
  const generatedAt = now.toISOString();

  const { data: completions, error: completionsError } = await supabase
    .from<CompletionRow>("level_completions")
    .select("level_id")
    .eq("user_id", userId);

  if (completionsError) {
    throw completionsError;
  }

  const completedContentIds = [...new Set((completions ?? []).map((completion) => completion.level_id))];

  if (completedContentIds.length === 0) {
    return buildReviewBoxesOverview(userId, generatedAt, [], now);
  }

  const { data: rows, error: reviewItemsError } = await supabase
    .from<ReviewItemRow>("review_items")
    .select(
      [
        "id",
        "user_id",
        "content_id",
        "content_type",
        "leitner_box",
        "last_reviewed_at",
        "next_review_at",
        "success_count",
        "failure_count",
        "created_at",
        "updated_at",
      ].join(", "),
    )
    .eq("user_id", userId)
    .eq("content_type", "exercise")
    .in("content_id", completedContentIds)
    .order("leitner_box", { ascending: true })
    .order("next_review_at", { ascending: true });

  if (reviewItemsError) {
    throw reviewItemsError;
  }

  return buildReviewBoxesOverview(userId, generatedAt, rows ?? [], now);
}

export function buildReviewBoxesOverview(
  userId: string,
  generatedAt: string,
  rows: ReviewItemRow[],
  now: Date,
): ReviewBoxesOverview {
  const items = rows
    .map((row) => buildReviewBoxOverviewItem(row, now))
    .filter((item): item is ReviewBoxOverviewItem => item !== null)
    .sort(compareReviewBoxItems);

  const boxes = LEITNER_BOXES.map((box) => buildReviewBoxOverview(box, items));
  const totalCount = boxes.reduce((sum, box) => sum + box.totalCount, 0);
  const dueCount = boxes.reduce((sum, box) => sum + box.dueCount, 0);

  return {
    userId,
    generatedAt,
    totalCount,
    dueCount,
    lockedCount: totalCount - dueCount,
    boxes,
  };
}

function buildReviewBoxOverview(
  box: LeitnerBox,
  allItems: ReviewBoxOverviewItem[],
): ReviewBoxOverview {
  const items = allItems.filter((item) => item.reviewItem.leitnerBox === box);
  const dueCount = items.filter((item) => item.isDue).length;
  const lockedItems = items.filter((item) => !item.isDue);
  const nextReviewAt = lockedItems[0]?.reviewItem.nextReviewAt ?? null;

  return {
    box,
    label: BOX_COPY[box].label,
    description: BOX_COPY[box].description,
    totalCount: items.length,
    dueCount,
    lockedCount: items.length - dueCount,
    nextReviewAt,
    items,
  };
}

function buildReviewBoxOverviewItem(row: ReviewItemRow, now: Date): ReviewBoxOverviewItem | null {
  const context = getContentContextById(row.content_id);

  if (context?.content.type !== "exercise") {
    return null;
  }

  const nextReviewDate = new Date(row.next_review_at);
  const isDue = nextReviewDate.getTime() <= now.getTime();

  return {
    reviewItem: mapReviewItemRow(row),
    exercise: {
      id: context.content.id,
      title: context.content.title,
      summary: context.content.summary,
      difficulty: context.content.difficulty,
      xpReward: context.content.xpReward,
      estimatedDurationMinutes: context.content.estimatedDurationMinutes,
      levelNumber: context.level.levelNumber,
      levelTitle: context.level.title,
      themeTitle: context.theme.title,
      chapterTitle: context.chapter.title,
    },
    overdueDays: isDue ? getOverdueDays(row.next_review_at, now) : 0,
    daysUntilReview: isDue ? 0 : getDaysUntilReview(row.next_review_at, now),
    isDue,
  };
}

function compareReviewBoxItems(left: ReviewBoxOverviewItem, right: ReviewBoxOverviewItem): number {
  if (left.isDue !== right.isDue) {
    return left.isDue ? -1 : 1;
  }

  const nextReviewDiff =
    new Date(left.reviewItem.nextReviewAt).getTime() - new Date(right.reviewItem.nextReviewAt).getTime();

  if (nextReviewDiff !== 0) {
    return nextReviewDiff;
  }

  return left.exercise.title.localeCompare(right.exercise.title, "fr");
}

function getOverdueDays(nextReviewAt: string, now: Date): number {
  const overdueMs = now.getTime() - new Date(nextReviewAt).getTime();
  return Math.max(0, Math.floor(overdueMs / DAY_IN_MS));
}

function getDaysUntilReview(nextReviewAt: string, now: Date): number {
  const remainingMs = new Date(nextReviewAt).getTime() - now.getTime();
  return Math.max(1, Math.ceil(remainingMs / DAY_IN_MS));
}
