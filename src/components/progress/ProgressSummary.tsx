import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { UserProgressSummary } from "@/types/progress";

type ProgressSummaryProps = {
  currentLevelTitle: string | null;
  progress: UserProgressSummary;
  totalLevels: number;
};

export function ProgressSummary({ currentLevelTitle, progress, totalLevels }: ProgressSummaryProps) {
  const percentage =
    totalLevels > 0
      ? Math.round((progress.completedLevelIds.length / totalLevels) * 100)
      : 0;
  const crab = progress.crabProgress;

  return (
    <Card className="grid gap-5 p-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.9fr)]">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Résumé du parcours</p>
          <h2 className="text-2xl font-semibold text-foreground">
            {percentage}% terminé
          </h2>
        </div>

        <p className="text-sm leading-7 text-muted">
          {progress.completedLevelIds.length} exercice(s) réussi(s) sur {totalLevels}. Niveau en cours :{" "}
          <span className="font-semibold text-foreground">{currentLevelTitle ?? "indisponible"}</span>.
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted">Avancement du parcours</span>
            <span className="font-medium text-foreground">{percentage}%</span>
          </div>
          <ProgressBar tone="success" value={percentage} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        <MetricCard label="XP totale" value={`${progress.xpTotal}`} tone="accent" />
        <MetricCard label="Niveau du crabe" value={`Nv. ${crab.level}`} tone="violet" />
        <MetricCard
          label={crab.isMaxLevel ? "Statut" : "Prochain palier"}
          value={crab.isMaxLevel ? "Maximum" : `${crab.xpRemainingToNextLevel} XP`}
          tone="success"
        />
      </div>
    </Card>
  );
}

type MetricCardProps = {
  label: string;
  tone: "accent" | "success" | "violet";
  value: string;
};

const metricToneStyles = {
  accent: "border-accent/25 bg-accent/10",
  success: "border-emerald-400/25 bg-emerald-500/10",
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
