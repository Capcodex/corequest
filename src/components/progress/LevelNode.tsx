import Link from "next/link";
import { CrabAvatar, getStateLabel } from "@/components/progress/CrabAvatar";
import { Level } from "@/types/level";
import { LevelProgressState } from "@/types/progress";

type LevelNodeProps = {
  isCurrentTarget: boolean;
  isLast: boolean;
  level: Level;
  side: "left" | "right";
  state: LevelProgressState;
};

const stateCardStyles: Record<LevelProgressState, string> = {
  completed: "border-emerald-400/30 bg-emerald-500/12 hover:border-emerald-300/50",
  in_progress: "border-accent/45 bg-accent/12 hover:border-accentSoft/55",
  available: "border-sky-400/30 bg-sky-500/10 hover:border-sky-300/45",
  locked: "border-border bg-panelAlt/90 opacity-80",
};

const stateNodeStyles: Record<LevelProgressState, string> = {
  completed: "border-emerald-300 bg-emerald-400 text-slate-950 shadow-[0_0_0_10px_rgba(34,197,94,0.12)]",
  in_progress: "border-accentSoft bg-accent text-slate-950 shadow-[0_0_0_10px_rgba(245,158,11,0.14)]",
  available: "border-sky-300 bg-sky-400 text-slate-950 shadow-[0_0_0_10px_rgba(56,189,248,0.12)]",
  locked: "border-slate-600 bg-slate-800 text-slate-300 shadow-[0_0_0_10px_rgba(15,23,42,0.18)]",
};

const stateBadgeStyles: Record<LevelProgressState, string> = {
  completed: "bg-emerald-400/15 text-emerald-100",
  in_progress: "bg-accent/15 text-amber-100",
  available: "bg-sky-400/15 text-sky-100",
  locked: "bg-slate-700/50 text-slate-300",
};

export function LevelNode({ isCurrentTarget, isLast, level, side, state }: LevelNodeProps) {
  const isLocked = state === "locked";
  const alignClassName = side === "left" ? "md:pr-14" : "md:pl-14";
  const cardContainerClassName = side === "left" ? "md:mr-auto" : "md:ml-auto";
  const mobileLineClassName = "left-7";
  const desktopLineClassName = "md:left-1/2 md:-translate-x-1/2";

  const content = (
    <div
      className={`group relative w-full max-w-xl rounded-[2rem] border px-5 py-5 shadow-glow transition duration-200 ${stateCardStyles[state]} ${isLocked ? "cursor-default" : "hover:-translate-y-1"}`.trim()}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-muted">
              Niveau {level.orderIndex}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${stateBadgeStyles[state]}`.trim()}>
              {getStateLabel(state)}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">{level.title}</h3>
            <p className="mt-2 text-sm text-muted">{level.concept}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-2 text-right">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted">XP</p>
          <p className="mt-1 text-lg font-semibold text-foreground">{level.xpReward}</p>
        </div>
      </div>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">{level.summary}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-full bg-slate-950/35 px-3 py-2 text-muted">
          Concept : {level.concept}
        </span>
        {!isLocked ? (
          <span className="rounded-full bg-white/5 px-3 py-2 text-foreground">
            {state === "completed" ? "Ouvrir de nouveau" : "Ouvrir"}
          </span>
        ) : (
          <span className="rounded-full bg-slate-950/35 px-3 py-2 text-slate-400">
            Terminez le niveau précédent pour le débloquer.
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className={`relative pb-10 ${isLast ? "pb-0" : ""}`.trim()}>
      {!isLast ? (
        <div
          aria-hidden="true"
          className={`absolute top-16 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent ${mobileLineClassName} ${desktopLineClassName}`.trim()}
        />
      ) : null}

      <div className={`relative pl-20 md:pl-0 ${alignClassName}`.trim()}>
        <div
          aria-hidden="true"
          className={`absolute top-8 z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 ${stateNodeStyles[state]} ${mobileLineClassName} -translate-x-1/2 ${desktopLineClassName}`.trim()}
        >
          <span className="text-lg font-bold">{level.orderIndex}</span>
        </div>

        {isCurrentTarget ? (
          <div
            aria-hidden="true"
            className={`absolute -top-6 z-20 ${mobileLineClassName} md:left-1/2 md:-translate-x-1/2`}
          >
            <CrabAvatar size="md" variant={state === "completed" ? "celebration" : "current"} className="ring-4 ring-background motion-safe:animate-pulse" />
          </div>
        ) : null}

        <div className={`w-full max-w-xl ${cardContainerClassName}`.trim()}>
          {isLocked ? (
            content
          ) : (
            <Link href={`/levels/${level.id}`} aria-label={`Ouvrir le niveau ${level.orderIndex} : ${level.title}`}>
              {content}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
