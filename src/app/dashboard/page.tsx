import { ContinueLearningCard } from "@/components/dashboard/ContinueLearningCard";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { Card } from "@/components/ui/Card";
import { requireUser } from "@/lib/auth/requireUser";
import { getLevelById } from "@/lib/levels/getLevelById";
import { getUserProgress } from "@/lib/progress/getUserProgress";

export default async function DashboardPage() {
  const user = await requireUser({ nextPath: "/dashboard" });
  const progress = await getUserProgress(user.id);
  const currentLevel = getLevelById(progress.currentLevelId);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <Card className="space-y-3 p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Dashboard</p>
        <h1 className="text-3xl font-semibold text-foreground">
          Bon retour{progress.displayName ? `, ${progress.displayName}` : ""}.
        </h1>
        <p className="text-sm leading-7 text-muted">
          Vous pouvez reprendre votre parcours Rust là où vous l’avez laissé.
        </p>
      </Card>

      <DashboardSummary progress={progress} />
      <ContinueLearningCard currentLevel={currentLevel} />
    </div>
  );
}

