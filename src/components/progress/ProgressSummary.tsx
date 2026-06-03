import { Card } from "@/components/ui/Card";
import { UserProgressSummary } from "@/types/progress";

type ProgressSummaryProps = {
  progress: UserProgressSummary;
  totalLevels: number;
};

export function ProgressSummary({ progress, totalLevels }: ProgressSummaryProps) {
  const percentage =
    totalLevels > 0
      ? Math.round((progress.completedLevelIds.length / totalLevels) * 100)
      : 0;

  return (
    <Card className="space-y-4 p-6">
      <p className="text-sm uppercase tracking-[0.24em] text-muted">Résumé de progression</p>
      <h2 className="text-2xl font-semibold text-foreground">{percentage}% du parcours débloqué</h2>
      <p className="text-sm leading-7 text-muted">
        {progress.completedLevelIds.length} niveau(x) terminé(s) sur {totalLevels}. Prochain
        niveau cible : {progress.currentLevelId}.
      </p>
    </Card>
  );
}

