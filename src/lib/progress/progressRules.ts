import { CurriculumLevel, LearningContent } from "@/types/content";
import { Level } from "@/types/level";

export function shouldGrantXp(completedLevelIds: string[], levelId: string) {
  return !completedLevelIds.includes(levelId);
}

export function getNextLevelId(levels: Level[], levelId: string) {
  const levelIndex = levels.findIndex((level) => level.id === levelId);

  if (levelIndex === -1) {
    return null;
  }

  return levels[levelIndex + 1]?.id ?? null;
}

export function isLevelUnlocked(
  levels: Level[],
  completedLevelIds: string[],
  levelId: string,
) {
  const levelIndex = levels.findIndex((level) => level.id === levelId);

  if (levelIndex === -1) {
    return false;
  }

  if (levelIndex === 0) {
    return true;
  }

  const previousLevelId = levels[levelIndex - 1]?.id;
  return previousLevelId ? completedLevelIds.includes(previousLevelId) : false;
}

export function isCurriculumLevelUnlocked(
  curriculumLevels: CurriculumLevel[],
  completedContentIds: string[],
  levelId: string,
) {
  const level = curriculumLevels.find((entry) => entry.id === levelId);

  if (!level) {
    return false;
  }

  return level.unlockRules.every((rule) => {
    switch (rule.type) {
      case "always":
        return true;
      case "complete_content":
        return completedContentIds.includes(rule.contentId);
      case "complete_chapter": {
        const chapterContents = curriculumLevels
          .flatMap((entry) => entry.themes)
          .flatMap((theme) => theme.chapters)
          .find((chapter) => chapter.id === rule.chapterId)?.contents;

        return chapterContents ? chapterContents.every((content) => isCompletableContentCompleted(content, completedContentIds)) : false;
      }
      case "complete_level": {
        const requiredLevel = curriculumLevels.find((entry) => entry.id === rule.levelId);

        if (!requiredLevel) {
          return false;
        }

        const requiredContents = requiredLevel.themes.flatMap((theme) => theme.chapters).flatMap((chapter) => chapter.contents);
        return requiredContents.every((content) => isCompletableContentCompleted(content, completedContentIds));
      }
      default:
        return false;
    }
  });
}

function isCompletableContentCompleted(content: LearningContent, completedContentIds: string[]) {
  return content.type === "gate" ? true : completedContentIds.includes(content.id);
}