export type AnalyticsEventName =
  | "page_home_viewed"
  | "cta_start_clicked"
  | "onboarding_started"
  | "level_viewed"
  | "project_viewed"
  | "project_run_started"
  | "project_run_completed"
  | "project_validation_completed"
  | "code_execution_started"
  | "code_execution_completed"
  | "code_compile_error"
  | "code_wrong_output"
  | "code_timeout"
  | "level_completed"
  | "premium_interest_clicked";

export type AnalyticsEvent = {
  name: AnalyticsEventName;
  userId?: string | null;
  anonymousSessionId?: string | null;
  properties?: Record<string, string | number | boolean | null>;
};

export type AnalyticsEventPayload = {
  name: AnalyticsEventName;
  anonymousSessionId?: string | null;
  properties?: Record<string, string | number | boolean | null>;
};