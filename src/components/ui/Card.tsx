import { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-border bg-panel/90 shadow-glow ${className}`.trim()}
      {...props}
    />
  );
}
