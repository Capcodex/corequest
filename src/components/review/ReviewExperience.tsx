"use client";

import { useState } from "react";
import { ExerciseBlock } from "@/components/level/ExerciseBlock";
import { HintBox } from "@/components/level/HintBox";
import { LessonBlock } from "@/components/level/LessonBlock";
import { MissionBlock } from "@/components/level/MissionBlock";
import { ReviewPlayground } from "@/components/review/ReviewPlayground";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Level } from "@/types/level";

type ReviewExperienceProps = {
  level: Level;
};

export function ReviewExperience({ level }: ReviewExperienceProps) {
  const [showLesson, setShowLesson] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Mode rappel actif</p>
          <p className="max-w-3xl text-sm leading-7 text-muted">
            Le cours reste masqué par défaut. Vous pouvez le rouvrir si nécessaire, puis décider explicitement si l’exercice doit être retravaillé.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={() => setShowLesson((current) => !current)}>
          {showLesson ? "Masquer le cours" : "Revoir le cours"}
        </Button>
      </Card>

      {showLesson ? (
        <div className="mx-auto max-w-4xl space-y-6">
          <MissionBlock missionText={level.missionText} concept={level.concept} />
          <LessonBlock exampleCode={level.exampleCode} lessonSections={level.lessonSections} />
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)]">
        <div className="space-y-6">
          <MissionBlock missionText={level.missionText} concept={level.concept} />
          <ExerciseBlock
            expectedOutput={level.expectedOutput}
            instructions={level.instructions}
            stdin={level.stdin ?? null}
            validationMode={level.validation.mode}
          />
          <HintBox hint={level.hint} />
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ReviewPlayground level={level} />
        </div>
      </div>
    </div>
  );
}
