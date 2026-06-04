import { CrabAvatar } from "@/components/progress/CrabAvatar";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Level } from "@/types/level";
import { UserProgressSummary } from "@/types/progress";

type DashboardSummaryProps = {
  currentLevel: Level | null;
  progress: UserProgressSummary;
  totalLevels: number;
};

export function DashboardSummary({ currentLevel, progress, totalLevels }: DashboardSummaryProps) {
  const completedLevels = progress.completedLevelIds.length;
  const completionPercentage = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;
  const crab = progress.crabProgress;
  const crabVariant = crab.isMaxLevel ? "celebration" : completedLevels > 0 ? "current" : "idle";

  return (
    <Card className="overflow-hidden">
      <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.15fr)_340px] lg:p-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Vue d’ensemble</p>
            <h2 className="text-3xl font-semibold text-foreground">Progression actuelle</h2>
            <p className="max-w-3xl text-sm leading-7 text-muted md:text-base">
              Vous suivez ici l’avancement global, le niveau en cours et le prochain palier de progression.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
            <div className="rounded-[2rem] border border-border bg-panelAlt/80 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-accent/12 px-3 py-1 text-xs font-medium text-amber-100">
                  Niveau en cours
                </span>
                {currentLevel ? (
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted">
                    {currentLevel.concept}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-foreground">
                {currentLevel ? currentLevel.title : "Aucun niveau courant détecté"}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                {currentLevel
                  ? currentLevel.summary
                  : "La progression ne remonte pas encore de niveau actif pour cette session."}
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/30 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Parcours</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{completionPercentage}%</p>
              <p className="mt-2 text-sm text-muted">
                {completedLevels} sur {totalLevels} exercice(s) réussi(s)
              </p>
              <ProgressBar className="mt-4" tone="success" value={completionPercentage} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="XP totale" value={`${progress.xpTotal}`} tone="accent" />
            <Metric label="Exercices réussis" value={`${completedLevels}/${totalLevels}`} tone="success" />
            <Metric label="Niveau du crabe" value={`Nv. ${crab.level}`} tone="violet" />
            <Metric
              label={crab.isMaxLevel ? "Statut" : "Prochain palier"}
              value={crab.isMaxLevel ? "Maximum" : `${crab.xpRemainingToNextLevel} XP`}
              tone="sky"
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-panelAlt/80 p-6">
          <div className="flex items-center gap-4">
            <CrabAvatar level={crab.level} size="lg" variant={crabVariant} />
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-muted">Avatar de progression</p>
              <h3 className="mt-2 text-2xl font-semibold text-foreground">
                Crabe niveau {crab.level}
              </h3>
              <p className="text-sm text-muted">{crab.title}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Progression du crabe</p>
              <p className="mt-2 text-sm text-foreground">
                {crab.isMaxLevel
                  ? "Le niveau maximum du crabe est atteint sur le parcours actuel."
                  : `${crab.xpRemainingToNextLevel} XP avant le niveau ${crab.nextLevel}.`}
              </p>
              <ProgressBar
                className="mt-4"
                tone="violet"
                value={crab.isMaxLevel ? 100 : crab.progressPercentage}
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Lecture rapide</p>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li>• Le crabe synthétise la progression XP.</li>
                <li>• Les premiers paliers montent vite.</li>
                <li>• Les suivants demandent un effort plus régulier.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

type MetricProps = {
  label: string;
  tone: "accent" | "success" | "sky" | "violet";
  value: string;
};

const toneClassNames = {
  accent: "border-accent/25 bg-accent/10",
  success: "border-emerald-400/25 bg-emerald-500/10",
  sky: "border-sky-400/25 bg-sky-500/10",
  violet: "border-violet-400/25 bg-violet-500/10",
};

function Metric({ label, tone, value }: MetricProps) {
  return (
    <div className={`rounded-[1.75rem] border p-4 ${toneClassNames[tone]}`.trim()}>
      <p className="text-xs uppercase tracking-[0.22em] text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
