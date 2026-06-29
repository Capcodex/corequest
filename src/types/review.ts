export type LeitnerBox = 1 | 2 | 3 | 4 | 5 | 6;

export type ReviewContentType = "exercise";

export type ReviewResult = "success" | "failure";

export type ReviewItem = {
  id: string;
  userId: string;
  contentId: string;
  contentType: ReviewContentType;
  leitnerBox: LeitnerBox;
  lastReviewedAt: string | null;
  nextReviewAt: string;
  successCount: number;
  failureCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ReviewAttempt = {
  id: string;
  userId: string;
  reviewItemId: string;
  contentId: string;
  result: ReviewResult;
  previousBox: LeitnerBox;
  nextBox: LeitnerBox;
  reviewedAt: string;
};

export type ReviewSessionExercise = {
  id: string;
  title: string;
  summary: string;
  difficulty: string;
  xpReward: number;
  estimatedDurationMinutes: number;
  levelNumber: number;
  levelTitle: string;
  themeTitle: string;
  chapterTitle: string;
};

export type DailyReviewSessionItem = {
  reviewItem: ReviewItem;
  exercise: ReviewSessionExercise;
  overdueDays: number;
};

export type DailyReviewSession = {
  userId: string;
  generatedAt: string;
  limit: number;
  dueCount: number;
  hasMore: boolean;
  items: DailyReviewSessionItem[];
};

export type ReviewBoxOverviewItem = DailyReviewSessionItem & {
  daysUntilReview: number;
  isDue: boolean;
};

export type ReviewBoxOverview = {
  box: LeitnerBox;
  label: string;
  description: string;
  totalCount: number;
  dueCount: number;
  lockedCount: number;
  nextReviewAt: string | null;
  items: ReviewBoxOverviewItem[];
};

export type ReviewBoxesOverview = {
  userId: string;
  generatedAt: string;
  totalCount: number;
  dueCount: number;
  lockedCount: number;
  boxes: ReviewBoxOverview[];
};

export type SubmitReviewRequest = {
  contentId: string;
  result: ReviewResult;
};

export type SubmitReviewResponse = {
  attempt: ReviewAttempt;
  reviewItem: ReviewItem;
};
