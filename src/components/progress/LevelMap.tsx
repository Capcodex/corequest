import { getLevelState } from "@/lib/progress/getLevelState";
import { Level } from "@/types/level";
import { UserProgress } from "@/types/progress";
import { LevelNode } from "./LevelNode";

type LevelMapProps = {
  levels: Level[];
  progress: UserProgress;
};

export function LevelMap({ levels, progress }: LevelMapProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {levels.map((level, index) => (
        <LevelNode
          key={level.id}
          level={level}
          state={getLevelState(level, progress, levels[index - 1]?.id)}
        />
      ))}
    </div>
  );
}
