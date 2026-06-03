import Link from "next/link";
import { Level } from "@/types/level";
import { LevelProgressState } from "@/types/progress";

type LevelNodeProps = {
  level: Level;
  state: LevelProgressState;
};

const stateStyles: Record<LevelProgressState, string> = {
  completed: "border-emerald-500/30 bg-emerald-500/10",
  in_progress: "border-accent/40 bg-accent/10",
  available: "border-sky-500/30 bg-sky-500/10",
  locked: "border-border bg-panelAlt opacity-70",
};

export function LevelNode({ level, state }: LevelNodeProps) {
  const content = (
    <div className={`rounded-3xl border p-5 ${stateStyles[state]}`.trim()}>
      <p className="text-xs uppercase tracking-[0.22em] text-muted">Niveau {level.orderIndex}</p>
      <h3 className="mt-3 text-xl font-semibold text-foreground">{level.title}</h3>
      <p className="mt-2 text-sm leading-7 text-muted">{level.summary}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted">État : {state}</p>
    </div>
  );

  if (state === "locked") {
    return content;
  }

  return <Link href={`/levels/${level.id}`}>{content}</Link>;
}

