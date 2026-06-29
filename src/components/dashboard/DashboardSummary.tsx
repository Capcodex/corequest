import { CrabAvatar } from "@/components/progress/CrabAvatar";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CurriculumRoadmap } from "@/lib/progress/getCurriculumRoadmap";
import { UserProgressSummary } from "@/types/progress";

type DashboardSummaryProps = {
  progress: UserProgressSummary;
  roadmap: CurriculumRoadmap;
};

export function DashboardSummary({ progress, roadmap }: DashboardSummaryProps) {
  const crab = progress.crabProgress;
  const crabVariant = crab.isMaxLevel ? "celebration" : roadmap.completedExerciseCount > 0 ? "current" : "idle";
  const chapterPercentage =
    roadmap.totalChapterCount > 0
      ? Math.round((roadmap.completedChapterCount / roadmap.totalChapterCount) * 100)
      : 0;
  const exercisePercentage =
    roadmap.totalExerciseCount > 0
      ? Math.round((roadmap.completedExerciseCount / roadmap.totalExerciseCount) * 100)
      : 0;

  return (
    <Card className="overflow-hidden">
      <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.15fr)_340px] lg:p-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Vue d’ensemble</p>
            <h2 className="text-3xl font-semibold text-foreground">Progression actuelle</h2>
            <p className="max-w-3xl text-sm leading-7 text-muted md:text-base">
              Suivez ici le niveau actif, le chapitre à reprendre, l’état des projets de synthèse et les prochains jalons du parcours.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
            <div className="rounded-[2rem] border border-border bg-panelAlt/80 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-accent/12 px-3 py-1 text-xs font-medium text-amber-100">
                  Niveau en cours
                </span>
                {roadmap.currentChapter ? (
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted">
                    {roadmap.currentChapter.themeTitle}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-foreground">
                {roadmap.currentLevel ? roadmap.currentLevel.title : "Aucun niveau courant détecté"}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                {roadmap.currentChapter
                  ? `${roadmap.currentChapter.title} · ${roadmap.currentChapter.completedExerciseCount}/${roadmap.currentChapter.totalExerciseCount} exercice(s) validé(s).`
                  : "La progression ne remonte pas encore de chapitre actif pour cette session."}
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/30 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Chapitres</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{chapterPercentage}%</p>
              <p className="mt-2 text-sm text-muted">
                {roadmap.completedChapterCount} sur {roadmap.totalChapterCount} validé(s)
              </p>
              <ProgressBar className="mt-4" tone="success" value={chapterPercentage} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="XP totale" value={`${progress.xpTotal}`} tone="accent" />
            <Metric label="Exercices validés" value={`${roadmap.completedExerciseCount}/${roadmap.totalExerciseCount}`} tone="success" />
            <Metric label="Projets ouverts" value={`${roadmap.availableProjectCount}`} tone="sky" />
            <Metric label="Niveau du crabe" value={`Nv. ${crab.level}`} tone="violet" />
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/30 p-5">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted">Avancement par exercices</span>
              <span className="font-medium text-foreground">{exercisePercentage}%</span>
            </div>
            <ProgressBar className="mt-4" tone="accent" value={exercisePercentage} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-panelAlt/80 p-6">
          <div className="flex items-center gap-4">
            <CrabAvatar level={crab.level} size="lg" variant={crabVariant} />
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-muted">Avatar de progression</p>
              <h3 className="mt-2 text-2xl font-semibold text-foreground">Crabe niveau {crab.level}</h3>
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
              <ProgressBar className="mt-4" tone="violet" value={crab.isMaxLevel ? 100 : crab.progressPercentage} />
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Prochain jalon</p>
              <p className="mt-2 text-sm text-foreground">
                {roadmap.nextProject
                  ? `${roadmap.nextProject.title} · ${roadmap.nextProject.status === "available" ? "ouvert" : "à venir"}.`
                  : "Aucun projet de synthèse n’est encore défini pour la suite immédiate du parcours."}
              </p>
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