import { notFound } from "next/navigation";
import { TrackEventOnMount } from "@/components/analytics/TrackEventOnMount";
import { LevelExperience } from "@/components/level/LevelExperience";
import { LevelHeader } from "@/components/level/LevelHeader";
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
  const nextLevelId = getNextLevelId(getLevels(), levelId);

  if (!level) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8">
      <TrackEventOnMount
        eventName="level_viewed"
        properties={{
          levelId: level.id,
          orderIndex: level.orderIndex,
          pathId: level.pathId,
        }}
      />
      <LevelHeader level={level} />
      <LevelExperience level={level} nextLevelId={nextLevelId} />
    </div>
  );
}