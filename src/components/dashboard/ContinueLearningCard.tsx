import Link from "next/link";
import { CrabAvatar } from "@/components/progress/CrabAvatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Level } from "@/types/level";
import { UserProgressSummary } from "@/types/progress";

type ContinueLearningCardProps = {
  currentLevel: Level | null;
  progress: UserProgressSummary;
};

export function ContinueLearningCard({ currentLevel, progress }: ContinueLearningCardProps) {
  const crab = progress.crabProgress;
  const crabVariant = crab.isMaxLevel ? "celebration" : currentLevel ? "current" : "idle";

  return (
    <Card className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.1fr)_320px] lg:p-8">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">À reprendre</p>
        <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
          {currentLevel ? currentLevel.title : "Prêt pour la suite du parcours"}
        </h2>
        <p className="text-sm leading-7 text-muted md:text-base">
          {currentLevel
            ? currentLevel.summary
            : "Aucun niveau courant n’a pu être identifié pour cette session."}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          {currentLevel ? (
            <Button asChild>
              <Link href={`/levels/${currentLevel.id}`}>Reprendre ce niveau</Link>
            </Button>
          ) : null}
          <Button asChild variant="secondary">
            <Link href="/map">Voir le parcours</Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4 rounded-[2rem] border border-white/10 bg-panelAlt/90 p-5">
        <div className="flex items-center gap-4">
          <CrabAvatar level={crab.level} size="md" variant={crabVariant} />
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Repère visuel</p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              Crabe niveau {crab.level} — {crab.title}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Palier suivant</p>
          <p className="mt-2 text-sm text-foreground">
            {crab.isMaxLevel
              ? "Le niveau maximum du crabe est atteint."
              : `${crab.xpRemainingToNextLevel} XP avant le niveau ${crab.nextLevel}.`}
          </p>
          <ProgressBar
            className="mt-4"
            tone="violet"
            value={crab.isMaxLevel ? 100 : crab.progressPercentage}
          />
        </div>

        {currentLevel ? (
          <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm text-muted">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Focus actuel</p>
            <p className="mt-2 text-foreground">
              <span className="font-semibold">Concept :</span> {currentLevel.concept}
            </p>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
