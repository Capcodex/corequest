type ProgressBarProps = {
  value: number;
  tone?: "accent" | "success" | "sky" | "violet";
  className?: string;
  label?: string;
};

const toneClassNames = {
  accent: "bg-accent",
  success: "bg-emerald-400",
  sky: "bg-sky-400",
  violet: "bg-violet-400",
};

export function ProgressBar({ value, tone = "accent", className = "", label = "Progression" }: ProgressBarProps) {
  const normalizedValue = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div
      className={`h-2.5 w-full overflow-hidden rounded-full bg-white/8 ${className}`.trim()}
      aria-label={label}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={normalizedValue}
      role="progressbar"
    >
      <div
        aria-hidden="true"
        className={`h-full rounded-full transition-all duration-300 ${toneClassNames[tone]}`.trim()}
        style={{ width: `${normalizedValue}%` }}
      />
    </div>
  );
}
