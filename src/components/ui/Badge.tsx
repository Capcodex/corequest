import { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement>;

export function Badge({ className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-border bg-panelAlt px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted ${className}`.trim()}
      {...props}
    />
  );
}
