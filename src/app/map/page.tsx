import { LevelMap } from "@/components/progress/LevelMap";
import { ProgressSummary } from "@/components/progress/ProgressSummary";
import { Card } from "@/components/ui/Card";
import { requireUser } from "@/lib/auth/requireUser";
import { getLevelById } from "@/lib/levels/getLevelById";
import { getLevels } from "@/lib/levels/getLevels";
import { getUserProgress } from "@/lib/progress/getUserProgress";

export default async function MapPage() {
  const user = await requireUser({ nextPath: "/map" });
  const levels = getLevels();
  const progress = await getUserProgress(user.id);
  const currentLevel = getLevelById(progress.currentLevelId);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8">
      <Card className="space-y-4 p-6 md:p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Carte de progression</p>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Parcours Rust</h1>
          <p className="max-w-3xl text-sm leading-7 text-muted md:text-base">
            Visualisez les niveaux déjà terminés, le niveau en cours et la suite du parcours dans une seule vue.
          </p>
        </div>
      </Card>
      <ProgressSummary
        currentLevelTitle={currentLevel?.title ?? null}
        progress={progress}
        totalLevels={levels.length}
      />
      <LevelMap levels={levels} progress={progress} />
    </div>
  );
}
