import { LevelMap } from "@/components/progress/LevelMap";
import { ProgressSummary } from "@/components/progress/ProgressSummary";
import { Card } from "@/components/ui/Card";
import { requireUser } from "@/lib/auth/requireUser";
import { getLevels } from "@/lib/levels/getLevels";
import { getUserProgress } from "@/lib/progress/getUserProgress";

export default async function MapPage() {
  const user = await requireUser({ nextPath: "/map" });
  const levels = getLevels();
  const progress = await getUserProgress(user.id);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8">
      <Card className="space-y-3 p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Carte de progression</p>
        <h1 className="text-3xl font-semibold text-foreground">Votre parcours Rust</h1>
        <p className="text-sm leading-7 text-muted">
          Les niveaux terminés restent rejouables. Les niveaux verrouillés se débloquent par
          réussite successive.
        </p>
      </Card>
      <ProgressSummary progress={progress} totalLevels={levels.length} />
      <LevelMap levels={levels} progress={progress} />
    </div>
  );
}

