import { getContentContextById } from "@/lib/content/getCurriculum";
import { createClient } from "@/lib/supabase/server";
import { DailyReviewSession, DailyReviewSessionItem, ReviewItem } from "@/types/review";

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const MAX_CANDIDATE_ITEMS = 50;

export const DEFAULT_DAILY_REVIEW_LIMIT = 7;

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
  limit: (count: number) => QueryBuilder<TData>;
  lte: (column: string, value: string) => QueryBuilder<TData>;
  order: (column: string, options: { ascending: boolean }) => QueryBuilder<TData>;
};

type ReviewSessionClient = {
  from: <TData>(table: string) => {
    select: (columns: string) => QueryBuilder<TData>;
  };
};

type CompletionRow = {
  level_id: string;
};

export type ReviewItemRow = {
  id: string;
  user_id: string;
  content_id: string;
  content_type: "exercise";
  leitner_box: 1 | 2 | 3 | 4 | 5 | 6;
  last_reviewed_at: string | null;
  next_review_at: string;
  success_count: number;
  failure_count: number;
  created_at: string;
  updated_at: string;
};

type GetDailyReviewSessionOptions = {
  limit?: number;
  now?: Date;
  supabase?: unknown;
};

export async function getDailyReviewSession(
  userId: string,
  options: GetDailyReviewSessionOptions = {},
): Promise<DailyReviewSession> {
  const supabase = options.supabase
    ? (options.supabase as ReviewSessionClient)
    : ((await createClient()) as unknown as ReviewSessionClient);
  const now = options.now ?? new Date();
  const limit = options.limit ?? DEFAULT_DAILY_REVIEW_LIMIT;
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
    return buildEmptySession(userId, generatedAt, limit);
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
    .lte("next_review_at", generatedAt)
    .order("next_review_at", { ascending: true })
    .order("leitner_box", { ascending: true })
    .limit(MAX_CANDIDATE_ITEMS);

  if (reviewItemsError) {
    throw reviewItemsError;
  }

  const sortedItems = buildDailyReviewSessionItems(rows ?? [], completedContentIds, {
    now,
    seed: `${userId}:${toDateKey(now)}`,
  });

  return {
    userId,
    generatedAt,
    limit,
    dueCount: sortedItems.length,
    hasMore: sortedItems.length > limit,
    items: sortedItems.slice(0, limit),
  };
}

export function buildDailyReviewSessionItems(
  rows: ReviewItemRow[],
  completedContentIds: string[],
  options: { now: Date; seed: string },
): DailyReviewSessionItem[] {
  const completedContentIdSet = new Set(completedContentIds);

  return rows
    .filter((row) => completedContentIdSet.has(row.content_id))
    .map((row) => buildDailyReviewSessionItem(row, options.now))
    .filter((item): item is DailyReviewSessionItem => item !== null)
    .sort((left, right) => compareReviewSessionItems(left, right, options.seed));
}

export function mapReviewItemRow(row: ReviewItemRow): ReviewItem {
  return {
    id: row.id,
    userId: row.user_id,
    contentId: row.content_id,
    contentType: row.content_type,
    leitnerBox: row.leitner_box,
    lastReviewedAt: row.last_reviewed_at,
    nextReviewAt: row.next_review_at,
    successCount: row.success_count,
    failureCount: row.failure_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function buildDailyReviewSessionItem(row: ReviewItemRow, now: Date): DailyReviewSessionItem | null {
  const context = getContentContextById(row.content_id);

  if (context?.content.type !== "exercise") {
    return null;
  }

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
    overdueDays: getOverdueDays(row.next_review_at, now),
  };
}

function compareReviewSessionItems(
  left: DailyReviewSessionItem,
  right: DailyReviewSessionItem,
  seed: string,
): number {
  const nextReviewDiff =
    new Date(left.reviewItem.nextReviewAt).getTime() - new Date(right.reviewItem.nextReviewAt).getTime();

  if (nextReviewDiff !== 0) {
    return nextReviewDiff;
  }

  const boxDiff = left.reviewItem.leitnerBox - right.reviewItem.leitnerBox;

  if (boxDiff !== 0) {
    return boxDiff;
  }

  return stableHash(`${seed}:${left.reviewItem.contentId}`) - stableHash(`${seed}:${right.reviewItem.contentId}`);
}

function getOverdueDays(nextReviewAt: string, now: Date): number {
  const overdueMs = now.getTime() - new Date(nextReviewAt).getTime();
  return Math.max(0, Math.floor(overdueMs / DAY_IN_MS));
}

function buildEmptySession(userId: string, generatedAt: string, limit: number): DailyReviewSession {
  return {
    userId,
    generatedAt,
    limit,
    dueCount: 0,
    hasMore: false,
    items: [],
  };
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function stableHash(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}
