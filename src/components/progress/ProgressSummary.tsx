import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CurriculumRoadmap } from "@/lib/progress/getCurriculumRoadmap";
import { UserProgressSummary } from "@/types/progress";

type ProgressSummaryProps = {
  progress: UserProgressSummary;
  roadmap: CurriculumRoadmap;
};

export function ProgressSummary({ progress, roadmap }: ProgressSummaryProps) {
  const chapterPercentage =
    roadmap.totalChapterCount > 0
      ? Math.round((roadmap.completedChapterCount / roadmap.totalChapterCount) * 100)
      : 0;
  const exercisePercentage =
    roadmap.totalExerciseCount > 0
      ? Math.round((roadmap.completedExerciseCount / roadmap.totalExerciseCount) * 100)
      : 0;
  const crab = progress.crabProgress;

  return (
    <Card className="grid gap-5 p-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.95fr)]">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Résumé du parcours</p>
          <h2 className="text-2xl font-semibold text-foreground">{chapterPercentage}% des chapitres validés</h2>
        </div>

        <p className="text-sm leading-7 text-muted">
          {roadmap.completedChapterCount} chapitre(s) validé(s) sur {roadmap.totalChapterCount}. Niveau actif :{" "}
          <span className="font-semibold text-foreground">{roadmap.currentLevel?.title ?? "indisponible"}</span>.{" "}
          Chapitre courant :{" "}
          <span className="font-semibold text-foreground">{roadmap.currentChapter?.title ?? "à déterminer"}</span>.
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted">Progression par chapitres</span>
            <span className="font-medium text-foreground">{chapterPercentage}%</span>
          </div>
          <ProgressBar tone="success" value={chapterPercentage} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted">Progression par exercices</span>
            <span className="font-medium text-foreground">{exercisePercentage}%</span>
          </div>
          <ProgressBar tone="accent" value={exercisePercentage} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <MetricCard label="XP totale" value={`${progress.xpTotal}`} tone="accent" />
        <MetricCard label="Exercices validés" value={`${roadmap.completedExerciseCount}/${roadmap.totalExerciseCount}`} tone="success" />
        <MetricCard label="Projets ouverts" value={`${roadmap.availableProjectCount}`} tone="sky" />
        <MetricCard
          label={crab.isMaxLevel ? "Crabe" : "Prochain palier"}
          value={crab.isMaxLevel ? `Nv. ${crab.level}` : `${crab.xpRemainingToNextLevel} XP`}
          tone="violet"
        />
      </div>
    </Card>
  );
}

type MetricCardProps = {
  label: string;
  tone: "accent" | "success" | "sky" | "violet";
  value: string;
};

const metricToneStyles = {
  accent: "border-accent/25 bg-accent/10",
  success: "border-emerald-400/25 bg-emerald-500/10",
  sky: "border-sky-400/25 bg-sky-500/10",
  violet: "border-violet-400/25 bg-violet-500/10",
};

function MetricCard({ label, tone, value }: MetricCardProps) {
  return (
    <div className={`rounded-3xl border p-4 ${metricToneStyles[tone]}`.trim()}>
      <p className="text-xs uppercase tracking-[0.22em] text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
    </div>
  );
}