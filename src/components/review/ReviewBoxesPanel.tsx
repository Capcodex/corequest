"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LeitnerBox, ReviewBoxesOverview, ReviewBoxOverviewItem } from "@/types/review";

type ReviewBoxesPanelProps = {
  overview: ReviewBoxesOverview;
};

export function ReviewBoxesPanel({ overview }: ReviewBoxesPanelProps) {
  const initialBox = useMemo(() => getInitialBox(overview), [overview]);
  const [selectedBox, setSelectedBox] = useState<LeitnerBox>(initialBox);
  const activeBox = overview.boxes.find((box) => box.box === selectedBox) ?? overview.boxes[0];

  if (overview.totalCount === 0) {
    return (
      <Card className="space-y-4 p-6 lg:p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Cycle Leitner</p>
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-6">
          <h2 className="text-2xl font-semibold text-foreground">Aucune box active pour le moment.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            Les exercices rejoignent les box de révision après leur première validation. Continuez le parcours pour
            alimenter votre cycle de consolidation.
          </p>
          <div className="mt-5">
            <Button asChild>
              <Link href="/map">Continuer le parcours</Link>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="space-y-6 p-6 lg:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Cycle Leitner</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">Vue par box</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
            Sélectionnez une box pour voir les exercices disponibles maintenant et ceux déjà planifiés pour plus tard.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="border-accent/30 bg-accent/10 text-amber-100">{overview.dueCount} disponible(s)</Badge>
          <Badge>{overview.lockedCount} planifié(s)</Badge>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" aria-label="Box de révision Leitner">
        {overview.boxes.map((box) => {
          const isSelected = box.box === selectedBox;
          const nextReviewLabel = box.nextReviewAt ? formatNextReviewDate(box.nextReviewAt) : "Aucune échéance";

          return (
            <button
              key={box.box}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedBox(box.box)}
              className={[
                "min-h-44 rounded-[1.75rem] border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isSelected
                  ? "border-accent/70 bg-accent/15 shadow-[0_0_30px_rgba(245,158,11,0.14)]"
                  : "border-white/10 bg-slate-950/30 hover:border-accent/35 hover:bg-panelAlt/80",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-muted">{box.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{box.totalCount}</p>
                </div>
                {box.dueCount > 0 ? (
                  <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-amber-100">
                    {box.dueCount}
                  </span>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-muted">{box.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-slate-950/50 px-2.5 py-1 text-muted">
                  {box.lockedCount} verrouillé(s)
                </span>
                <span className="rounded-full bg-slate-950/50 px-2.5 py-1 text-muted">{nextReviewLabel}</span>
              </div>
            </button>
          );
        })}
      </div>

      <section className="rounded-[2rem] border border-white/10 bg-slate-950/35 p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted">{activeBox.label}</p>
            <h3 className="mt-2 text-xl font-semibold text-foreground">
              {activeBox.totalCount > 0 ? "Exercices de la box sélectionnée" : "Aucun exercice dans cette box"}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="border-accent/30 bg-accent/10 text-amber-100">{activeBox.dueCount} disponible(s)</Badge>
            <Badge>{activeBox.lockedCount} verrouillé(s)</Badge>
          </div>
        </div>

        {activeBox.items.length > 0 ? (
          <div className="mt-5 grid gap-4">
            {activeBox.items.map((item) => (
              <ReviewBoxExerciseRow key={item.reviewItem.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm leading-7 text-muted">
            Aucun exercice dans cette box. Les prochains passages y apparaîtront automatiquement selon vos réussites.
          </p>
        )}
      </section>
    </Card>
  );
}

function ReviewBoxExerciseRow({ item }: { item: ReviewBoxOverviewItem }) {
  return (
    <article className="grid gap-4 rounded-[1.75rem] border border-border bg-panelAlt/80 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge>Niveau {item.exercise.levelNumber}</Badge>
          <Badge>{item.exercise.chapterTitle}</Badge>
          {item.isDue ? (
            item.overdueDays > 0 ? (
              <Badge className="border-danger/30 bg-danger/10 text-red-100">
                {item.overdueDays} j de retard
              </Badge>
            ) : (
              <Badge className="border-accent/30 bg-accent/10 text-amber-100">Disponible</Badge>
            )
          ) : (
            <Badge className="border-white/10 bg-white/5 text-muted">
              Disponible dans {item.daysUntilReview} jour{item.daysUntilReview > 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        <div>
          <h4 className="text-lg font-semibold text-foreground">{item.exercise.title}</h4>
          <p className="mt-2 text-sm leading-7 text-muted">{item.exercise.summary}</p>
        </div>

        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <Info label="Difficulté" value={formatDifficulty(item.exercise.difficulty)} />
          <Info label="Durée" value={`${item.exercise.estimatedDurationMinutes} min`} />
          <Info label="Prochaine échéance" value={formatFullDate(item.reviewItem.nextReviewAt)} />
        </dl>
      </div>

      <div className="flex flex-col gap-3 md:min-w-44">
        {item.isDue ? (
          <Button asChild>
            <Link href={`/review/${item.exercise.id}`}>Réviser</Link>
          </Button>
        ) : (
          <Button disabled variant="secondary">
            Verrouillé
          </Button>
        )}
        <p className="text-center text-xs text-muted">{item.exercise.xpReward} XP d’origine</p>
      </div>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.2em] text-muted">{label}</dt>
      <dd className="mt-1 text-foreground">{value}</dd>
    </div>
  );
}

function getInitialBox(overview: ReviewBoxesOverview): LeitnerBox {
  return overview.boxes.find((box) => box.dueCount > 0)?.box ?? overview.boxes.find((box) => box.totalCount > 0)?.box ?? 1;
}

function formatNextReviewDate(value: string) {
  return `Prochaine ${new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  })}`;
}

function formatFullDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDifficulty(difficulty: string) {
  const labels: Record<string, string> = {
    intro: "Introduction",
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
  };

  return labels[difficulty] ?? difficulty;
}
