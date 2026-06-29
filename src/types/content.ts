export type LessonSection = {
  heading: string;
  content: string;
};

export type UnlockRule =
  | { type: "always" }
  | { type: "complete_level"; levelId: string }
  | { type: "complete_chapter"; chapterId: string }
  | { type: "complete_content"; contentId: string };

export type ContentDifficulty = "intro" | "beginner" | "intermediate" | "advanced";
export type ContentNodeType = "exercise" | "project" | "gate";

export type BaseContentNode = {
  id: string;
  type: ContentNodeType;
  levelId: string;
  levelNumber: number;
  themeId: string;
  chapterId: string;
  orderIndex: number;
  title: string;
  summary: string;
  xpReward: number;
  estimatedDurationMinutes: number;
  difficulty: ContentDifficulty;
  unlockRules: UnlockRule[];
};

export type ExerciseValidationMode = "stdout_exact" | "stdout_includes" | "exit_success";

export type ExerciseValidation =
  | {
      mode: "stdout_exact";
      expectedOutput: string;
      stdin?: string | null;
    }
  | {
      mode: "stdout_includes";
      expectedOutput: string;
      stdin?: string | null;
    }
  | {
      mode: "exit_success";
      stdin?: string | null;
    };

export type ExerciseContent = BaseContentNode & {
  type: "exercise";
  pathId: string;
  concept: string;
  missionText: string;
  lessonSections: LessonSection[];
  exampleCode: string;
  instructions: string[];
  expectedOutput: string;
  stdin?: string | null;
  hint: string;
  starterMode: "empty";
  validation: ExerciseValidation;
};

export type ProjectFile = {
  path: string;
  content: string;
  readonly?: boolean;
  description?: string | null;
};

export type ProjectValidationScenario = {
  id: string;
  title: string;
  description: string;
  stdin?: string | null;
  validation: ExerciseValidation;
};

export type ProjectWorkspaceLayout = "split" | "stacked";

export type ProjectConfig = {
  files: ProjectFile[];
  entryFile: string;
  editableFiles: string[];
  readonlyFiles: string[];
  runCommand: string;
  testCommand?: string | null;
  tests: string[];
  validationScenarios: ProjectValidationScenario[];
  layout: ProjectWorkspaceLayout;
};

export type ProjectContent = BaseContentNode & {
  type: "project";
  overview: string;
  goals: string[];
  projectConfig: ProjectConfig;
  acceptanceCriteria: string[];
  statusNote?: string | null;
};

export type GateContent = BaseContentNode & {
  type: "gate";
  gateType: "level_unlock" | "theme_unlock";
  targetLevelId?: string | null;
  message: string;
  requiredContentIds: string[];
  requiredProjectIds: string[];
};

export type LearningContent = ExerciseContent | ProjectContent | GateContent;

export type Chapter = {
  id: string;
  levelId: string;
  levelNumber: number;
  themeId: string;
  orderIndex: number;
  title: string;
  summary: string;
  estimatedProblemCount: number;
  unlockRules: UnlockRule[];
  contents: LearningContent[];
  requiredForLevelCompletion?: boolean;
};

export type Theme = {
  id: string;
  levelId: string;
  levelNumber: number;
  orderIndex: number;
  title: string;
  summary: string;
  unlockRules: UnlockRule[];
  chapters: Chapter[];
  milestoneProjectId?: string | null;
};

export type CurriculumLevel = {
  id: string;
  levelNumber: number;
  orderIndex: number;
  title: string;
  summary: string;
  unlockRules: UnlockRule[];
  themes: Theme[];
};

export type Curriculum = {
  id: string;
  title: string;
  levels: CurriculumLevel[];
};

export type ContentContext = {
  level: CurriculumLevel;
  theme: Theme;
  chapter: Chapter;
  content: LearningContent;
};