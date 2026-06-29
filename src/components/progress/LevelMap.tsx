"use client";

import { useState } from "react";
import Link from "next/link";
import { CrabAvatar } from "@/components/progress/CrabAvatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  CurriculumRoadmap,
  RoadmapChapterNode,
  RoadmapExerciseNode,
  RoadmapItem,
  RoadmapLevel,
  RoadmapNodeState,
  RoadmapProjectNode,
} from "@/lib/progress/getCurriculumRoadmap";
import { UserProgressWithCrab } from "@/types/progress";

type LevelMapProps = {
  roadmap: CurriculumRoadmap;
  progress: UserProgressWithCrab;
};

export function LevelMap({ roadmap, progress }: LevelMapProps) {
  const crab = progress.crabProgress;
  const initialOpenLevelId = roadmap.currentLevel?.id ?? roadmap.levels[0]?.id ?? "";
  const [openLevelId, setOpenLevelId] = useState(initialOpenLevelId);
  const currentTargetId = progress.currentContentId ?? roadmap.currentChapter?.id ?? roadmap.nextProject?.id ?? null;

  return (
    <section className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-border bg-panelAlt/70 px-4 py-4 text-sm text-muted shadow-glow">
          <LegendChip tone="completed" label="Validé" />
          <LegendChip tone="current" label="En cours" />
          <LegendChip tone="available" label="Disponible" />
          <LegendChip tone="locked" label="Verrouillé" />
        </div>

        <div className="flex items-center gap-3 rounded-3xl border border-border bg-panelAlt/70 px-4 py-4 shadow-glow">
          <CrabAvatar level={crab.level} size="sm" variant={crab.isMaxLevel ? "celebration" : "current"} />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Repère de progression</p>
            <p className="mt-1 truncate text-sm font-medium text-foreground">
              {roadmap.currentChapter ? roadmap.currentChapter.title : roadmap.currentLevel?.title ?? "Parcours"}
            </p>
            <p className="text-sm text-muted">
              {crab.isMaxLevel
                ? "Palier maximum atteint."
                : `${crab.xpRemainingToNextLevel} XP avant le niveau ${crab.nextLevel}.`}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4" aria-label="Niveaux du parcours">
        {roadmap.levels.map((level) => (
          <LevelAccordion
            key={level.id}
            currentTargetId={currentTargetId}
            isOpen={openLevelId === level.id}
            level={level}
            onToggle={() => setOpenLevelId(openLevelId === level.id ? "" : level.id)}
          />
        ))}
      </div>
    </section>
  );
}

type LevelAccordionProps = {
  currentTargetId: string | null;
  isOpen: boolean;
  level: RoadmapLevel;
  onToggle: () => void;
};

function LevelAccordion({ currentTargetId, isOpen, level, onToggle }: LevelAccordionProps) {
  const progressPercentage =
    level.totalExerciseCount > 0 ? Math.round((level.completedExerciseCount / level.totalExerciseCount) * 100) : 0;

  return (
    <Card className={`overflow-hidden transition ${isOpen ? "border-accent/40" : ""}`.trim()}>
      <button
        id={`level-trigger-${level.id}`}
        type="button"
        aria-controls={`level-panel-${level.id}`}
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex w-full flex-col gap-4 px-5 py-5 text-left transition hover:bg-panelAlt/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset md:px-6"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/35 text-muted">
              <ChevronIcon isOpen={isOpen} />
            </span>

            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-muted">
                  Niveau {level.levelNumber}
                </span>
                <StatusBadge state={level.status} />
              </div>
              <h2 className="text-xl font-semibold text-foreground md:text-2xl">{level.title}</h2>
              <p className="max-w-3xl text-sm leading-7 text-muted">{level.summary}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[360px]">
            <InlineMetric label="Chapitres" value={`${level.completedChapterCount}/${level.totalChapterCount}`} />
            <InlineMetric label="Exercices" value={`${level.completedExerciseCount}/${level.totalExerciseCount}`} />
            <InlineMetric label="Statut" value={level.isUnlocked ? "Ouvert" : "Verrouillé"} />
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="h-2 overflow-hidden rounded-full bg-slate-950/60">
            <div className="h-full rounded-full bg-accent" style={{ width: `${progressPercentage}%` }} />
          </div>
          <p className="text-xs text-muted">
            {level.completedExerciseCount}/{level.totalExerciseCount} exercice(s)
          </p>
        </div>
      </button>

      {isOpen ? (
        <div
          id={`level-panel-${level.id}`}
          role="region"
          aria-labelledby={`level-trigger-${level.id}`}
          className="relative overflow-hidden border-t border-border px-5 py-6 md:px-6"
        >
          <div aria-hidden="true" className="absolute inset-0 bg-grid bg-[size:22px_22px] opacity-20" />
          <div className="relative space-y-5">
            {level.items.map((item, index) => (
              <RoadmapItemCard
                key={item.id}
                index={index}
                isCurrentTarget={currentTargetId === item.id}
                currentTargetId={currentTargetId}
                item={item}
              />
            ))}
          </div>
        </div>
      ) : null}
    </Card>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180 text-accent" : ""}`.trim()}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}

type RoadmapItemCardProps = {
  currentTargetId: string | null;
  index: number;
  isCurrentTarget: boolean;
  item: RoadmapItem;
};

function RoadmapItemCard({ currentTargetId, index, isCurrentTarget, item }: RoadmapItemCardProps) {
  const alignmentClassName = index % 2 === 0 ? "md:mr-14" : "md:ml-14";

  return (
    <div className={alignmentClassName}>
      {item.type === "chapter" ? (
        <ChapterCard chapter={item} currentTargetId={currentTargetId} isCurrentTarget={isCurrentTarget} />
      ) : (
        <ProjectCard project={item} isCurrentTarget={isCurrentTarget} />
      )}
    </div>
  );
}

function ChapterCard({
  chapter,
  currentTargetId,
  isCurrentTarget,
}: {
  chapter: RoadmapChapterNode;
  currentTargetId: string | null;
  isCurrentTarget: boolean;
}) {
  return (
    <div className={`relative rounded-[2rem] border p-5 shadow-glow ${cardStateClassNames[chapter.status]}`.trim()}>
      {isCurrentTarget ? (
        <div className="absolute -right-3 -top-3 rounded-full border border-border bg-background p-1 shadow-glow">
          <CrabAvatar level={1} size="sm" variant="current" />
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-muted">
          Chapitre
        </span>
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted">{chapter.themeTitle}</span>
        <StatusBadge state={chapter.status} />
      </div>

      <div className="mt-4 space-y-3">
        <h3 className="text-xl font-semibold text-foreground">{chapter.title}</h3>
        <p className="text-sm leading-7 text-muted">{chapter.summary}</p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <InlineMetric label="Exercices" value={`${chapter.completedExerciseCount}/${chapter.totalExerciseCount}`} />
        <InlineMetric label="XP" value={`${chapter.totalXpReward}`} />
        <InlineMetric label="Durée" value={`${chapter.estimatedDurationMinutes} min`} />
      </div>

      <ExerciseList exercises={chapter.exercises} currentTargetId={currentTargetId} />

      {chapter.gate ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/35 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-muted">
              Palier
            </span>
            <StatusBadge state={chapter.gate.status} />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">{chapter.gate.title}</p>
          <p className="mt-2 text-sm leading-7 text-muted">{chapter.gate.message}</p>
        </div>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {chapter.isRequiredForLevelCompletion
            ? "Compte pour la validation du niveau."
            : "Chapitre optionnel dans la validation du niveau."}
        </p>
        {chapter.href && chapter.status !== "locked" ? (
          <Button asChild size="sm">
            <Link href={chapter.href}>{chapter.status === "in_progress" ? "Continuer" : "Ouvrir le chapitre"}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function ExerciseList({
  currentTargetId,
  exercises,
}: {
  currentTargetId: string | null;
  exercises: RoadmapExerciseNode[];
}) {
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/35 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Exercices</p>
          <p className="mt-1 text-sm text-muted">Accès direct à chaque étape du chapitre.</p>
        </div>
        <p className="text-sm text-muted">{exercises.length} exercice(s)</p>
      </div>

      <div className="mt-4 grid gap-3">
        {exercises.map((exercise, index) => (
          <ExerciseRow
            key={exercise.id}
            exercise={exercise}
            index={index}
            isCurrentTarget={currentTargetId === exercise.id || exercise.status === "in_progress"}
          />
        ))}
      </div>
    </div>
  );
}

function ExerciseRow({
  exercise,
  index,
  isCurrentTarget,
}: {
  exercise: RoadmapExerciseNode;
  index: number;
  isCurrentTarget: boolean;
}) {
  const content = (
    <>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-muted">
          {index + 1}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">{exercise.title}</h4>
            {isCurrentTarget ? (
              <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-amber-100">
                Reprise
              </span>
            ) : null}
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{exercise.summary}</p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2 md:justify-end">
        <StatusBadge state={exercise.status} />
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-muted">{exercise.xpReward} XP</span>
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-muted">
          {exercise.estimatedDurationMinutes} min
        </span>
      </div>
    </>
  );

  const className = [
    "grid gap-3 rounded-2xl border p-4 transition md:grid-cols-[minmax(0,1fr)_auto] md:items-center",
    isCurrentTarget
      ? "border-accent/50 bg-accent/10"
      : exercise.status === "locked"
        ? "border-white/10 bg-slate-950/25 opacity-75"
        : "border-white/10 bg-panelAlt/70 hover:border-accent/35 hover:bg-panelAlt",
  ].join(" ");

  if (exercise.href && exercise.status !== "locked") {
    return (
      <Link href={exercise.href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

function ProjectCard({ project, isCurrentTarget }: { project: RoadmapProjectNode; isCurrentTarget: boolean }) {
  return (
    <div className={`relative rounded-[2rem] border p-5 shadow-glow ${cardStateClassNames[project.status]}`.trim()}>
      {isCurrentTarget ? (
        <div className="absolute -right-3 -top-3 rounded-full border border-border bg-background p-1 shadow-glow">
          <CrabAvatar level={1} size="sm" variant="current" />
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-muted">
          Projet de synthèse
        </span>
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted">{project.themeTitle}</span>
        <StatusBadge state={project.status} />
      </div>

      <div className="mt-4 space-y-3">
        <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
        <p className="text-sm leading-7 text-muted">{project.summary}</p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <InlineMetric label="Scénarios" value={`${project.validationScenarioCount}`} />
        <InlineMetric label="Tests" value={`${project.testCount}`} />
        <InlineMetric label="Durée" value={`${project.estimatedDurationMinutes} min`} />
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/35 p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Objectif</p>
        <p className="mt-2 text-sm leading-7 text-foreground">{project.overview}</p>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {project.status === "locked"
            ? "Terminez les chapitres requis pour ouvrir ce projet."
            : "Projet exécutable et validable dans la sandbox multi-fichiers."}
        </p>
        {project.status !== "locked" ? (
          <Button asChild size="sm">
            <Link href={project.href}>{project.status === "completed" ? "Rouvrir le projet" : "Ouvrir le projet"}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

type InlineMetricProps = {
  label: string;
  value: string;
};

function InlineMetric({ label, value }: InlineMetricProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">{label}</p>
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

type LegendChipProps = {
  label: string;
  tone: "completed" | "current" | "available" | "locked";
};

const legendDotStyles: Record<LegendChipProps["tone"], string> = {
  completed: "bg-emerald-400",
  current: "bg-accent",
  available: "bg-sky-400",
  locked: "bg-slate-500",
};

function LegendChip({ label, tone }: LegendChipProps) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">
      <span className={`h-2.5 w-2.5 rounded-full ${legendDotStyles[tone]}`.trim()} />
      <span>{label}</span>
    </div>
  );
}

const cardStateClassNames: Record<RoadmapNodeState, string> = {
  completed: "border-emerald-400/25 bg-emerald-500/10",
  in_progress: "border-accent/25 bg-accent/10",
  available: "border-sky-400/25 bg-sky-500/10",
  locked: "border-border bg-panelAlt/70",
};

function StatusBadge({ state }: { state: RoadmapNodeState }) {
  const label =
    state === "completed"
      ? "Validé"
      : state === "in_progress"
        ? "En cours"
        : state === "available"
          ? "Disponible"
          : "Verrouillé";

  const className =
    state === "completed"
      ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-100"
      : state === "in_progress"
        ? "border-accent/25 bg-accent/12 text-amber-100"
        : state === "available"
          ? "border-sky-400/25 bg-sky-500/10 text-sky-100"
          : "border-white/10 bg-white/5 text-muted";

  return <span className={`rounded-full border px-3 py-1 text-xs font-medium ${className}`.trim()}>{label}</span>;
}
