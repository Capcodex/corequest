import { Level } from "@/types/level";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

type LevelHeaderProps = {
  level: Level;
};

export function LevelHeader({ level }: LevelHeaderProps) {
  return (
    <Card className="space-y-5 p-6 md:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <Badge>{level.pathId}</Badge>
        <Badge>Niveau {level.orderIndex}</Badge>
        <Badge>{level.xpReward} XP</Badge>
      </div>
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">{level.title}</h1>
        <p className="text-base text-muted">{level.summary}</p>
      </div>
    </Card>
  );
}
