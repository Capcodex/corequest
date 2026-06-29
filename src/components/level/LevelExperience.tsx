"use client";

import { useId, useState } from "react";
import { ExerciseBlock } from "@/components/level/ExerciseBlock";
import { HintBox } from "@/components/level/HintBox";
import { LessonBlock } from "@/components/level/LessonBlock";
import { LevelPlayground } from "@/components/level/LevelPlayground";
import { MissionBlock } from "@/components/level/MissionBlock";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Level } from "@/types/level";

type LevelExperienceProps = {
  level: Level;
  nextLevelId: string | null;
};

type Step = "lesson" | "exercise";

const stepContent = {
  lesson: {
    eyebrow: "Étape 1",
    title: "Cours",
    description: "Prenez le temps de lire le concept, l’explication et l’exemple avant de passer à la pratique.",
  },
  exercise: {
    eyebrow: "Étape 2",
    title: "Exercice",
    description: "Le cours disparaît de l’écran pour vous laisser travailler sans avoir l’exemple sous les yeux.",
  },
} as const;

export function LevelExperience({ level, nextLevelId }: LevelExperienceProps) {
  const [activeStep, setActiveStep] = useState<Step>("lesson");
  const lessonPanelId = useId();
  const exercisePanelId = useId();

  return (
    <div className="space-y-6">
      <Card className="space-y-5 p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Format du niveau</p>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Cours puis mise en pratique</h2>
              <p className="max-w-3xl text-sm leading-7 text-muted">
                Vous lisez d’abord le contenu utile, puis vous basculez dans un espace d’exercice dédié.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-panelAlt px-4 py-3 text-sm text-muted">
            {stepContent[activeStep].eyebrow} sur 2 · {stepContent[activeStep].title}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2" role="tablist" aria-label="Étapes du niveau">
          <StepButton
            isActive={activeStep === "lesson"}
            panelId={lessonPanelId}
            title={stepContent.lesson.title}
            eyebrow={stepContent.lesson.eyebrow}
            description={stepContent.lesson.description}
            onClick={() => setActiveStep("lesson")}
          />
          <StepButton
            isActive={activeStep === "exercise"}
            panelId={exercisePanelId}
            title={stepContent.exercise.title}
            eyebrow={stepContent.exercise.eyebrow}
            description={stepContent.exercise.description}
            onClick={() => setActiveStep("exercise")}
          />
        </div>
      </Card>

      <section
        id={lessonPanelId}
        aria-hidden={activeStep !== "lesson"}
        className={activeStep === "lesson" ? "space-y-6" : "hidden"}
      >
        <div className="mx-auto max-w-4xl space-y-6">
          <MissionBlock missionText={level.missionText} concept={level.concept} />
          <LessonBlock exampleCode={level.exampleCode} lessonSections={level.lessonSections} />
          <Card className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.24em] text-muted">Suite du niveau</p>
              <p className="text-sm leading-7 text-muted">
                Quand vous êtes prêt, passez à l’exercice. Le cours et l’exemple seront retirés de l’écran.
              </p>
            </div>
            <Button type="button" onClick={() => setActiveStep("exercise")}>Passer à l’exercice</Button>
          </Card>
        </div>
      </section>

      <section
        id={exercisePanelId}
        aria-hidden={activeStep !== "exercise"}
        className={activeStep === "exercise" ? "space-y-6" : "hidden"}
      >
        <Card className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Mode pratique</p>
            <p className="text-sm leading-7 text-muted">
              Vous avez maintenant uniquement l’énoncé, l’objectif attendu et l’éditeur Rust pour travailler en autonomie.
            </p>
          </div>
          <Button type="button" variant="secondary" onClick={() => setActiveStep("lesson")}>
            Revoir le cours
          </Button>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)]">
          <div className="space-y-6">
            <MissionBlock missionText={level.missionText} concept={level.concept} />
            <ExerciseBlock
              instructions={level.instructions}
              expectedOutput={level.expectedOutput}
              stdin={level.stdin ?? null}
              validationMode={level.validation.mode}
            />
            <HintBox hint={level.hint} />
          </div>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <LevelPlayground level={level} nextLevelId={nextLevelId} />
          </div>
        </div>
      </section>
    </div>
  );
}

type StepButtonProps = {
  description: string;
  eyebrow: string;
  isActive: boolean;
  onClick: () => void;
  panelId: string;
  title: string;
};

function StepButton({ description, eyebrow, isActive, onClick, panelId, title }: StepButtonProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-controls={panelId}
      aria-selected={isActive}
      onClick={onClick}
      className={[
        "rounded-2xl border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isActive
          ? "border-accent bg-accent/12 text-foreground"
          : "border-border bg-panelAlt text-muted hover:border-accent/40 hover:text-foreground",
      ].join(" ")}
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">{eyebrow}</p>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm leading-6 text-muted">{description}</p>
      </div>
    </button>
  );
}