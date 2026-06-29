import { getCurriculumLevels } from "@/lib/content/getCurriculum";
import { getProjectEntries } from "@/lib/content/getProjects";
import {
  Chapter,
  CurriculumLevel,
  ExerciseContent,
  GateContent,
  ProjectContent,
  Theme,
  UnlockRule,
} from "@/types/content";
import { LevelProgressState, UserProgressSummary } from "@/types/progress";

export type RoadmapNodeState = LevelProgressState;

export type RoadmapGateNode = {
  id: string;
  type: "gate";
  title: string;
  summary: string;
  message: string;
  status: RoadmapNodeState;
  completedRequiredContentCount: number;
  requiredContentCount: number;
};

export type RoadmapChapterNode = {
  id: string;
  type: "chapter";
  levelId: string;
  levelNumber: number;
  themeId: string;
  themeTitle: string;
  title: string;
  summary: string;
  status: RoadmapNodeState;
  href: string | null;
  completedExerciseCount: number;
  totalExerciseCount: number;
  totalXpReward: number;
  estimatedDurationMinutes: number;
  exercises: RoadmapExerciseNode[];
  gate: RoadmapGateNode | null;
  isRequiredForLevelCompletion: boolean;
};

export type RoadmapExerciseNode = {
  id: string;
  type: "exercise";
  title: string;
  summary: string;
  status: RoadmapNodeState;
  href: string | null;
  xpReward: number;
  estimatedDurationMinutes: number;
  difficulty: string;
};

export type RoadmapProjectNode = {
  id: string;
  type: "project";
  levelId: string;
  levelNumber: number;
  themeId: string;
  themeTitle: string;
  chapterId: string;
  title: string;
  summary: string;
  overview: string;
  status: RoadmapNodeState;
  href: string;
  estimatedDurationMinutes: number;
  validationScenarioCount: number;
  testCount: number;
};

export type RoadmapItem = RoadmapChapterNode | RoadmapProjectNode;

export type RoadmapLevel = {
  id: string;
  levelNumber: number;
  title: string;
  summary: string;
  status: RoadmapNodeState;
  isUnlocked: boolean;
  completedChapterCount: number;
  totalChapterCount: number;
  completedExerciseCount: number;
  totalExerciseCount: number;
  items: RoadmapItem[];
};

export type RecommendedAction = {
  kind: "exercise" | "project" | "map";
  label: string;
  href: string;
  title: string;
  description: string;
};

export type CurriculumRoadmap = {
  levels: RoadmapLevel[];
  currentLevel: RoadmapLevel | null;
  currentChapter: RoadmapChapterNode | null;
  nextProject: RoadmapProjectNode | null;
  completedExerciseCount: number;
  totalExerciseCount: number;
  completedChapterCount: number;
  totalChapterCount: number;
  availableProjectCount: number;
  recommendedAction: RecommendedAction;
};

type UnlockContext = {
  chaptersById: Map<string, Chapter>;
  completedContentIds: string[];
  completedProjectIds: string[];
  levels: CurriculumLevel[];
};

export function getCurriculumRoadmap(progress: UserProgressSummary): CurriculumRoadmap {
  const levels = getCurriculumLevels();
  const chaptersById = new Map(
    levels.flatMap((level) =>
      level.themes.flatMap((theme) => theme.chapters.map((chapter) => [chapter.id, chapter] as const)),
    ),
  );

  const context: UnlockContext = {
    chaptersById,
    completedContentIds: progress.completedContentIds ?? progress.completedLevelIds,
    completedProjectIds: progress.completedProjectIds ?? [],
    levels,
  };

  const projectsById = new Map(getProjectEntries().map((project) => [project.id, project]));

  const roadmapLevels = levels.map((level) => buildRoadmapLevel(level, projectsById, progress, context));
  const chapterNodes = roadmapLevels.flatMap((level) => level.items).filter(isRoadmapChapterNode);
  const projectNodes = roadmapLevels.flatMap((level) => level.items).filter(isRoadmapProjectNode);

  const currentChapter =
    chapterNodes.find((chapter) => chapter.id === progress.currentChapterId && chapter.status !== "completed") ??
    chapterNodes.find((chapter) => chapter.status === "in_progress") ??
    chapterNodes.find((chapter) => chapter.status === "available") ??
    null;

  const currentLevel =
    roadmapLevels.find((level) => level.id === currentChapter?.levelId) ??
    roadmapLevels.find((level) => level.id === progress.currentCurriculumLevelId) ??
    roadmapLevels.find((level) => level.status === "in_progress") ??
    roadmapLevels.find((level) => level.status === "available") ??
    null;

  const availableProjects = projectNodes.filter((project) => project.status === "available");
  const nextProject =
    availableProjects.at(-1) ??
    projectNodes.find((project) => project.status === "locked") ??
    null;

  const completedExerciseCount = chapterNodes.reduce((sum, chapter) => sum + chapter.completedExerciseCount, 0);
  const totalExerciseCount = chapterNodes.reduce((sum, chapter) => sum + chapter.totalExerciseCount, 0);
  const completedChapterCount = chapterNodes.filter((chapter) => chapter.status === "completed").length;
  const totalChapterCount = chapterNodes.length;
  const availableProjectCount = projectNodes.filter((project) => project.status === "available").length;

  return {
    levels: roadmapLevels,
    currentLevel,
    currentChapter,
    nextProject,
    completedExerciseCount,
    totalExerciseCount,
    completedChapterCount,
    totalChapterCount,
    availableProjectCount,
    recommendedAction: buildRecommendedAction(currentChapter, nextProject),
  };
}

function buildRecommendedAction(
  currentChapter: RoadmapChapterNode | null,
  nextProject: RoadmapProjectNode | null,
): RecommendedAction {
  if (currentChapter?.href && currentChapter.status !== "locked") {
    return {
      kind: "exercise",
      label: currentChapter.status === "in_progress" ? "Reprendre le chapitre" : "Commencer ce chapitre",
      href: currentChapter.href,
      title: currentChapter.title,
      description: `${currentChapter.completedExerciseCount}/${currentChapter.totalExerciseCount} exercice(s) validé(s) dans ${currentChapter.themeTitle}.`,
    };
  }

  if (nextProject && nextProject.status === "available") {
    return {
      kind: "project",
      label: "Ouvrir le projet",
      href: nextProject.href,
      title: nextProject.title,
      description: `${nextProject.validationScenarioCount} scénario(x) de validation prêt(s) dans ${nextProject.themeTitle}.`,
    };
  }

  return {
    kind: "map",
    label: "Voir le parcours",
    href: "/map",
    title: "Parcours complet",
    description: "Explorez les chapitres, jalons et projets disponibles dans la progression.",
  };
}

function buildRoadmapLevel(
  level: CurriculumLevel,
  projectsById: Map<string, ProjectContent>,
  progress: UserProgressSummary,
  context: UnlockContext,
): RoadmapLevel {
  const items: RoadmapItem[] = [];

  for (const theme of level.themes) {
    for (const chapter of theme.chapters) {
      items.push(buildRoadmapChapter(level, theme, chapter, progress, context));
    }

    if (theme.milestoneProjectId) {
      const project = projectsById.get(theme.milestoneProjectId);

      if (project) {
        items.push(buildRoadmapProject(level, theme, project, context));
      }
    }
  }

  const chapterNodes = items.filter(isRoadmapChapterNode);
  const completedChapterCount = chapterNodes.filter((chapter) => chapter.status === "completed").length;
  const totalChapterCount = chapterNodes.length;
  const completedExerciseCount = chapterNodes.reduce((sum, chapter) => sum + chapter.completedExerciseCount, 0);
  const totalExerciseCount = chapterNodes.reduce((sum, chapter) => sum + chapter.totalExerciseCount, 0);
  const isUnlocked = level.unlockRules.length === 0 || areUnlockRulesSatisfied(level.unlockRules, context);
  const isCompleted = isCurriculumLevelCompleted(level, context);
  const isStarted =
    chapterNodes.some((chapter) => chapter.status === "in_progress" || chapter.status === "completed") ||
    progress.currentCurriculumLevelId === level.id;

  return {
    id: level.id,
    levelNumber: level.levelNumber,
    title: level.title,
    summary: level.summary,
    status: isCompleted ? "completed" : !isUnlocked ? "locked" : isStarted ? "in_progress" : "available",
    isUnlocked,
    completedChapterCount,
    totalChapterCount,
    completedExerciseCount,
    totalExerciseCount,
    items,
  };
}

function buildRoadmapChapter(
  level: CurriculumLevel,
  theme: Theme,
  chapter: Chapter,
  progress: UserProgressSummary,
  context: UnlockContext,
): RoadmapChapterNode {
  const exercises = chapter.contents.filter((content): content is ExerciseContent => content.type === "exercise");
  const gate = chapter.contents.find((content): content is GateContent => content.type === "gate") ?? null;
  const completedExerciseCount = exercises.filter((exercise) => context.completedContentIds.includes(exercise.id)).length;
  const totalExerciseCount = exercises.length;
  const totalXpReward = exercises.reduce((sum, exercise) => sum + exercise.xpReward, 0);
  const estimatedDurationMinutes = exercises.reduce(
    (sum, exercise) => sum + exercise.estimatedDurationMinutes,
    0,
  );
  const isUnlocked = chapter.unlockRules.length === 0 || areUnlockRulesSatisfied(chapter.unlockRules, context);
  const exerciseNodes = exercises.map((exercise) =>
    buildRoadmapExercise(exercise, progress, context, isUnlocked),
  );
  const isCompleted = totalExerciseCount > 0 && completedExerciseCount === totalExerciseCount;
  const currentContentId = progress.currentContentId ?? progress.currentLevelId;
  const currentExerciseInChapter = exerciseNodes.find(
    (exercise) => exercise.id === currentContentId && exercise.status !== "completed",
  );
  const resumeExercise =
    currentExerciseInChapter ??
    exerciseNodes.find((exercise) => exercise.status === "available") ??
    exerciseNodes[0] ??
    null;

  return {
    id: chapter.id,
    type: "chapter",
    levelId: level.id,
    levelNumber: level.levelNumber,
    themeId: theme.id,
    themeTitle: theme.title,
    title: chapter.title,
    summary: chapter.summary,
    status: isCompleted
      ? "completed"
      : !isUnlocked
        ? "locked"
        : currentExerciseInChapter || completedExerciseCount > 0 || progress.currentChapterId === chapter.id
          ? "in_progress"
          : "available",
    href: resumeExercise?.href ?? null,
    completedExerciseCount,
    totalExerciseCount,
    totalXpReward,
    estimatedDurationMinutes,
    exercises: exerciseNodes,
    gate: gate ? buildRoadmapGate(gate, isCompleted, context) : null,
    isRequiredForLevelCompletion: chapter.requiredForLevelCompletion ?? true,
  };
}

function buildRoadmapExercise(
  exercise: ExerciseContent,
  progress: UserProgressSummary,
  context: UnlockContext,
  isChapterUnlocked: boolean,
): RoadmapExerciseNode {
  const currentContentId = progress.currentContentId ?? progress.currentLevelId;
  const isCompleted = context.completedContentIds.includes(exercise.id);
  const isUnlocked =
    isChapterUnlocked && (exercise.unlockRules.length === 0 || areUnlockRulesSatisfied(exercise.unlockRules, context));
  const status: RoadmapNodeState = isCompleted
    ? "completed"
    : !isUnlocked
      ? "locked"
      : currentContentId === exercise.id
        ? "in_progress"
        : "available";

  return {
    id: exercise.id,
    type: "exercise",
    title: exercise.title,
    summary: exercise.summary,
    status,
    href: status === "locked" ? null : `/levels/${exercise.id}`,
    xpReward: exercise.xpReward,
    estimatedDurationMinutes: exercise.estimatedDurationMinutes,
    difficulty: exercise.difficulty,
  };
}

function buildRoadmapGate(
  gate: GateContent,
  isChapterCompleted: boolean,
  context: UnlockContext,
): RoadmapGateNode {
  const completedRequiredContentCount = gate.requiredContentIds.filter((contentId) =>
    context.completedContentIds.includes(contentId),
  ).length;
  const requiredProjectCount = gate.requiredProjectIds.filter((projectId) =>
    context.completedProjectIds.includes(projectId),
  ).length;
  const gateCompleted =
    completedRequiredContentCount === gate.requiredContentIds.length &&
    requiredProjectCount === gate.requiredProjectIds.length;

  return {
    id: gate.id,
    type: "gate",
    title: gate.title,
    summary: gate.summary,
    message: gate.message,
    status: gateCompleted ? "completed" : isChapterCompleted ? "available" : "locked",
    completedRequiredContentCount,
    requiredContentCount: gate.requiredContentIds.length,
  };
}

function buildRoadmapProject(
  level: CurriculumLevel,
  theme: Theme,
  project: ProjectContent,
  context: UnlockContext,
): RoadmapProjectNode {
  const isUnlocked = project.unlockRules.length === 0 || areUnlockRulesSatisfied(project.unlockRules, context);
  const isCompleted = context.completedProjectIds.includes(project.id);

  return {
    id: project.id,
    type: "project",
    levelId: level.id,
    levelNumber: level.levelNumber,
    themeId: theme.id,
    themeTitle: theme.title,
    chapterId: project.chapterId,
    title: project.title,
    summary: project.summary,
    overview: project.overview,
    status: isCompleted ? "completed" : isUnlocked ? "available" : "locked",
    href: `/projects/${project.id}`,
    estimatedDurationMinutes: project.estimatedDurationMinutes,
    validationScenarioCount: project.projectConfig.validationScenarios.length,
    testCount: project.projectConfig.tests.length,
  };
}

function areUnlockRulesSatisfied(rules: UnlockRule[], context: UnlockContext): boolean {
  return rules.every((rule) => {
    switch (rule.type) {
      case "always":
        return true;
      case "complete_content":
        return context.completedContentIds.includes(rule.contentId) || context.completedProjectIds.includes(rule.contentId);
      case "complete_chapter": {
        const chapter = context.chaptersById.get(rule.chapterId);
        return chapter ? isChapterCompleted(chapter, context) : false;
      }
      case "complete_level": {
        const level = context.levels.find((entry) => entry.id === rule.levelId);
        return level ? isCurriculumLevelCompleted(level, context) : false;
      }
      default:
        return false;
    }
  });
}

function isChapterCompleted(chapter: Chapter, context: UnlockContext) {
  const exercises = chapter.contents.filter((content): content is ExerciseContent => content.type === "exercise");
  return exercises.length > 0 && exercises.every((exercise) => context.completedContentIds.includes(exercise.id));
}

function isCurriculumLevelCompleted(level: CurriculumLevel, context: UnlockContext) {
  const chapters = level.themes.flatMap((theme) => theme.chapters);
  const requiredChapters = chapters.filter((chapter) => chapter.requiredForLevelCompletion ?? true);
  const chaptersToCheck = requiredChapters.length > 0 ? requiredChapters : chapters;

  return chaptersToCheck.length > 0 && chaptersToCheck.every((chapter) => isChapterCompleted(chapter, context));
}

function isRoadmapChapterNode(item: RoadmapItem): item is RoadmapChapterNode {
  return item.type === "chapter";
}

function isRoadmapProjectNode(item: RoadmapItem): item is RoadmapProjectNode {
  return item.type === "project";
}
