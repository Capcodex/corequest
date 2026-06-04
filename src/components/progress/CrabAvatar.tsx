import { LevelProgressState } from "@/types/progress";

type CrabAvatarProps = {
  className?: string;
  level?: number;
  size?: "sm" | "md" | "lg";
  variant?: "current" | "celebration" | "idle";
};

const sizeClassNames = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-20 w-20",
};

const badgeSizeClassNames = {
  sm: "h-5 min-w-5 px-1.5 text-[10px]",
  md: "h-6 min-w-6 px-2 text-[11px]",
  lg: "h-7 min-w-7 px-2.5 text-xs",
};

const variantGlow = {
  current: "from-accent/35 via-accentSoft/15 to-transparent",
  celebration: "from-emerald-400/35 via-emerald-300/15 to-transparent",
  idle: "from-sky-400/20 via-sky-300/10 to-transparent",
};

export function CrabAvatar({ className = "", level, size = "md", variant = "idle" }: CrabAvatarProps) {
  const shellColor = variant === "celebration" ? "#22c55e" : variant === "current" ? "#f59e0b" : "#38bdf8";
  const clawColor = variant === "celebration" ? "#4ade80" : variant === "current" ? "#fbbf24" : "#7dd3fc";

  return (
    <div
      aria-hidden="true"
      className={`relative grid place-items-center rounded-full bg-gradient-to-br ${variantGlow[variant]} ${sizeClassNames[size]} ${className}`.trim()}
    >
      <svg
        viewBox="0 0 96 96"
        className="h-[82%] w-[82%] drop-shadow-[0_10px_16px_rgba(2,6,23,0.35)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="48" cy="56" rx="24" ry="20" fill={shellColor} />
        <path d="M25 54C18 49 15 42 17 35C25 35 31 39 34 45" fill={clawColor} />
        <path d="M71 54C78 49 81 42 79 35C71 35 65 39 62 45" fill={clawColor} />
        <path d="M24 58L11 66" stroke={clawColor} strokeWidth="5" strokeLinecap="round" />
        <path d="M72 58L85 66" stroke={clawColor} strokeWidth="5" strokeLinecap="round" />
        <path d="M33 70L22 80" stroke={clawColor} strokeWidth="5" strokeLinecap="round" />
        <path d="M63 70L74 80" stroke={clawColor} strokeWidth="5" strokeLinecap="round" />
        <path d="M41 72L33 84" stroke={clawColor} strokeWidth="5" strokeLinecap="round" />
        <path d="M55 72L63 84" stroke={clawColor} strokeWidth="5" strokeLinecap="round" />
        <circle cx="40" cy="45" r="5.5" fill="#F8FAFC" />
        <circle cx="56" cy="45" r="5.5" fill="#F8FAFC" />
        <circle cx="40" cy="45" r="2.5" fill="#0F172A" />
        <circle cx="56" cy="45" r="2.5" fill="#0F172A" />
        <path d="M39 58C42 61 54 61 57 58" stroke="#F8FAFC" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M38 29L35 18" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
        <path d="M58 29L61 18" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
        <circle cx="35" cy="16" r="3" fill="#F8FAFC" />
        <circle cx="61" cy="16" r="3" fill="#F8FAFC" />
      </svg>
      {level ? (
        <div className={`absolute -bottom-1 -right-1 inline-flex items-center justify-center rounded-full border border-slate-950/70 bg-slate-950 text-[11px] font-semibold text-white shadow-lg ${badgeSizeClassNames[size]}`.trim()}>
          {level}
        </div>
      ) : null}
    </div>
  );
}

export function getStateLabel(state: LevelProgressState) {
  switch (state) {
    case "completed":
      return "Complété";
    case "in_progress":
      return "En cours";
    case "available":
      return "Disponible";
    case "locked":
      return "Verrouillé";
    default:
      return state;
  }
}
