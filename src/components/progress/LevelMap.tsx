import { getLevelState } from "@/lib/progress/getLevelState";
import { Level } from "@/types/level";
import { UserProgressWithCrab } from "@/types/progress";
import { CrabAvatar } from "./CrabAvatar";
import { LevelNode } from "./LevelNode";

type LevelMapProps = {
  levels: Level[];
  progress: UserProgressWithCrab;
};

export function LevelMap({ levels, progress }: LevelMapProps) {
  const roadmapLevels: Array<{
    level: Level;
    side: "left" | "right";
    state: ReturnType<typeof getLevelState>;
  }> = levels.map((level, index) => ({
    level,
    side: index % 2 === 0 ? "left" : "right",
    state: getLevelState(level, progress, levels[index - 1]?.id),
  }));
  const crab = progress.crabProgress;
  const currentLevel = levels.find((level) => level.id == progress.currentLevelId) ?? null;

  return (
    <section className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-border bg-panelAlt/70 px-4 py-4 text-sm text-muted shadow-glow">
          <LegendChip tone="completed" label="Terminé" />
          <LegendChip tone="current" label="En cours" />
          <LegendChip tone="available" label="Disponible" />
          <LegendChip tone="locked" label="Verrouillé" />
        </div>

        <div className="flex items-center gap-3 rounded-3xl border border-border bg-panelAlt/70 px-4 py-4 shadow-glow">
          <CrabAvatar level={crab.level} size="sm" variant={crab.isMaxLevel ? "celebration" : "current"} />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">Position actuelle</p>
            <p className="mt-1 truncate text-sm font-medium text-foreground">
              {currentLevel ? currentLevel.title : "Niveau courant indisponible"}
            </p>
            <p className="text-sm text-muted">
              {crab.isMaxLevel ? "Palier maximum atteint." : `${crab.xpRemainingToNextLevel} XP avant le niveau ${crab.nextLevel}.`}
            </p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-panel/70 p-5 shadow-glow md:p-8">
        <div aria-hidden="true" className="absolute inset-0 bg-grid bg-[size:22px_22px] opacity-30" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-white/4 via-transparent to-transparent" />
        <div className="relative space-y-6">
          {roadmapLevels.map(({ level, side, state }, index) => (
            <LevelNode
              key={level.id}
              isCurrentTarget={progress.currentLevelId === level.id}
              isLast={index === roadmapLevels.length - 1}
              level={level}
              side={side}
              state={state}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type LegendChipProps = {
  label: string;
  tone: "completed" | "current" | "available" | "locked";
};

const legendDotStyles: Record<LegendChipProps["tone"], string> = {
  completed: "bg-emerald-400",
  current: "bg-accent",
  available: "bg-sky-400",
  locked: "bg-slate-500",
};

function LegendChip({ label, tone }: LegendChipProps) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">
      <span className={`h-2.5 w-2.5 rounded-full ${legendDotStyles[tone]}`.trim()} />
      <span>{label}</span>
    </div>
  );
}
