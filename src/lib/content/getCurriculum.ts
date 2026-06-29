import { rustFoundationsCurriculum } from "@/data/rust-foundations/curriculum";
import {
  Chapter,
  ContentContext,
  Curriculum,
  CurriculumLevel,
  ExerciseContent,
  LearningContent,
  Theme,
} from "@/types/content";

export function getCurriculum(): Curriculum {
  return rustFoundationsCurriculum;
}

export function getCurriculumLevels(): CurriculumLevel[] {
  return [...rustFoundationsCurriculum.levels].sort((left, right) => left.orderIndex - right.orderIndex);
}

export function getCurriculumLevelById(levelId: string): CurriculumLevel | null {
  return getCurriculumLevels().find((level) => level.id === levelId) ?? null;
}

export function getThemes(): Theme[] {
  return getCurriculumLevels().flatMap((level) => level.themes);
}

export function getThemeById(themeId: string): Theme | null {
  return getThemes().find((theme) => theme.id === themeId) ?? null;
}

export function getChapters(): Chapter[] {
  return getThemes().flatMap((theme) => theme.chapters);
}

export function getChapterById(chapterId: string): Chapter | null {
  return getChapters().find((chapter) => chapter.id === chapterId) ?? null;
}

export function getAllContentEntries(): LearningContent[] {
  return getChapters()
    .flatMap((chapter) => chapter.contents)
    .sort((left, right) => left.orderIndex - right.orderIndex);
}

export function getExerciseEntries(): ExerciseContent[] {
  return getAllContentEntries()
    .filter((entry): entry is ExerciseContent => entry.type === "exercise")
    .sort((left, right) => left.orderIndex - right.orderIndex);
}

export function getContentEntryById(contentId: string): LearningContent | null {
  return getAllContentEntries().find((entry) => entry.id === contentId) ?? null;
}

export function getContentContextById(contentId: string): ContentContext | null {
  for (const level of getCurriculumLevels()) {
    for (const theme of level.themes) {
      for (const chapter of theme.chapters) {
        const content = chapter.contents.find((entry) => entry.id === contentId);

        if (content) {
          return {
            level,
            theme,
            chapter,
            content,
          };
        }
      }
    }
  }

  return null;
}