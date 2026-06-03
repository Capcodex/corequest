import { notFound } from "next/navigation";
import { TrackEventOnMount } from "@/components/analytics/TrackEventOnMount";
import { ExerciseBlock } from "@/components/level/ExerciseBlock";
import { HintBox } from "@/components/level/HintBox";
import { LessonBlock } from "@/components/level/LessonBlock";
import { LevelHeader } from "@/components/level/LevelHeader";
import { LevelPlayground } from "@/components/level/LevelPlayground";
import { MissionBlock } from "@/components/level/MissionBlock";
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
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
      <TrackEventOnMount
        eventName="level_viewed"
        properties={{
          levelId: level.id,
          orderIndex: level.orderIndex,
          pathId: level.pathId,
        }}
      />
      <div className="space-y-6">
        <LevelHeader level={level} />
        <MissionBlock missionText={level.missionText} concept={level.concept} />
        <LessonBlock
          exampleCode={level.exampleCode}
          lessonSections={level.lessonSections}
        />
        <ExerciseBlock instructions={level.instructions} expectedOutput={level.expectedOutput} />
        <HintBox hint={level.hint} />
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <LevelPlayground level={level} nextLevelId={nextLevelId} />
      </div>
    </div>
  );
}
