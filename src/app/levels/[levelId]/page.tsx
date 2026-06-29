import { notFound } from "next/navigation";
import { TrackEventOnMount } from "@/components/analytics/TrackEventOnMount";
import { LevelExperience } from "@/components/level/LevelExperience";
import { LevelHeader } from "@/components/level/LevelHeader";
import { getContentContextById } from "@/lib/content/getCurriculum";
import { getLevelById } from "@/lib/levels/getLevelById";
import { getLevels } from "@/lib/levels/getLevels";
import { getNextLevelId } from "@/lib/progress/progressRules";

type LevelPageProps = {
  params: Promise<{
    levelId: string;
  }>;
};

export default async function LevelPage({ params }: LevelPageProps) {
  const { levelId } = await params;
  const level = getLevelById(levelId);

  if (!level) {
    notFound();
  }

  const context = getContentContextById(levelId);
  const nextLevelId = getNextLevelId(getLevels(), levelId);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8">
      <TrackEventOnMount
        eventName="level_viewed"
        properties={{
          levelId: level.id,
          orderIndex: level.orderIndex,
          pathId: level.pathId,
          curriculumLevelId: context?.level.id ?? null,
          themeId: context?.theme.id ?? null,
          chapterId: context?.chapter.id ?? null,
        }}
      />
      <LevelHeader level={level} context={context} />
      <LevelExperience level={level} nextLevelId={nextLevelId} />
    </div>
  );
}