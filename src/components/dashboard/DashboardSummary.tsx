import { Card } from "@/components/ui/Card";
import { UserProgressSummary } from "@/types/progress";

type DashboardSummaryProps = {
  progress: UserProgressSummary;
};

export function DashboardSummary({ progress }: DashboardSummaryProps) {
  return (
    <Card className="grid gap-4 p-6 md:grid-cols-3">
      <Metric label="XP total" value={`${progress.xpTotal}`} />
      <Metric label="Niveaux terminés" value={`${progress.completedLevelIds.length}`} />
      <Metric label="Niveau actuel" value={progress.currentLevelId} />
    </Card>
  );
}

type MetricProps = {
  label: string;
  value: string;
};

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-2xl border border-border bg-panelAlt p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

