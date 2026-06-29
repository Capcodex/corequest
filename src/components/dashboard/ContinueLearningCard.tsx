import Link from "next/link";
import { CrabAvatar } from "@/components/progress/CrabAvatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CurriculumRoadmap } from "@/lib/progress/getCurriculumRoadmap";
import { UserProgressSummary } from "@/types/progress";

type ContinueLearningCardProps = {
  progress: UserProgressSummary;
  roadmap: CurriculumRoadmap;
};

export function ContinueLearningCard({ progress, roadmap }: ContinueLearningCardProps) {
  const crab = progress.crabProgress;
  const crabVariant = crab.isMaxLevel ? "celebration" : roadmap.currentChapter ? "current" : "idle";
  const action = roadmap.recommendedAction;
  const nextProjectIsSecondary = roadmap.nextProject?.status === "available" && action.kind !== "project";

  return (
    <Card className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.1fr)_320px] lg:p-8">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">À reprendre</p>
        <h2 className="text-2xl font-semibold text-foreground md:text-3xl">{action.title}</h2>
        <p className="text-sm leading-7 text-muted md:text-base">{action.description}</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
          {nextProjectIsSecondary && roadmap.nextProject ? (
            <Button asChild variant="secondary">
              <Link href={roadmap.nextProject.href}>Ouvrir le projet</Link>
            </Button>
          ) : (
            <Button asChild variant="secondary">
              <Link href="/map">Voir le parcours</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4 rounded-[2rem] border border-white/10 bg-panelAlt/90 p-5">
        <div className="flex items-center gap-4">
          <CrabAvatar level={crab.level} size="md" variant={crabVariant} />
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Repère visuel</p>
            <p className="mt-2 text-lg font-semibold text-foreground">Crabe niveau {crab.level} — {crab.title}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Chapitre actif</p>
          <p className="mt-2 text-sm text-foreground">
            {roadmap.currentChapter
              ? `${roadmap.currentChapter.title} · ${roadmap.currentChapter.completedExerciseCount}/${roadmap.currentChapter.totalExerciseCount} exercice(s) validé(s).`
              : "Aucun chapitre actif détecté pour cette session."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Palier suivant</p>
          <p className="mt-2 text-sm text-foreground">
            {crab.isMaxLevel
              ? "Le niveau maximum du crabe est atteint."
              : `${crab.xpRemainingToNextLevel} XP avant le niveau ${crab.nextLevel}.`}
          </p>
          <ProgressBar className="mt-4" tone="violet" value={crab.isMaxLevel ? 100 : crab.progressPercentage} />
        </div>

        {roadmap.nextProject ? (
          <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm text-muted">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Projet de synthèse</p>
            <p className="mt-2 text-foreground">
              <span className="font-semibold">{roadmap.nextProject.title}</span>
              {" "}· {roadmap.nextProject.status === "available" ? "ouvert" : "à venir"}
            </p>
          </div>
        ) : null}
      </div>
    </Card>
  );
}