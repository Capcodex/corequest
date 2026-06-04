import { ContinueLearningCard } from "@/components/dashboard/ContinueLearningCard";
import { DashboardSummary } from "@/components/dashboard/DashboardSummary";
import { Card } from "@/components/ui/Card";
import { requireUser } from "@/lib/auth/requireUser";
import { getLevelById } from "@/lib/levels/getLevelById";
import { getLevels } from "@/lib/levels/getLevels";
import { getUserProgress } from "@/lib/progress/getUserProgress";

export default async function DashboardPage() {
  const user = await requireUser({ nextPath: "/dashboard" });
  const progress = await getUserProgress(user.id);
  const currentLevel = getLevelById(progress.currentLevelId);
  const totalLevels = getLevels().length;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8">
      <Card className="space-y-4 p-6 md:p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Tableau de bord</p>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
            Bon retour{progress.displayName ? `, ${progress.displayName}` : ""}.
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-muted md:text-base">
            Une vue claire de votre progression, du niveau à reprendre et du prochain palier à atteindre.
          </p>
        </div>
      </Card>

      <DashboardSummary currentLevel={currentLevel} progress={progress} totalLevels={totalLevels} />
      <ContinueLearningCard currentLevel={currentLevel} progress={progress} />
    </div>
  );
}
