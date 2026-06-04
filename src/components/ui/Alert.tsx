import { HTMLAttributes } from "react";

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  tone?: "info" | "success" | "danger";
};

const toneClassNames = {
  info: "border-sky-500/20 bg-sky-500/10 text-sky-100",
  success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-100",
  danger: "border-rose-500/20 bg-rose-500/10 text-rose-100",
};

const toneRoles = {
  info: "status",
  success: "status",
  danger: "alert",
} as const;

export function Alert({ className = "", tone = "info", ...props }: AlertProps) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${toneClassNames[tone]} ${className}`.trim()}
      role={toneRoles[tone]}
      {...props}
    />
  );
}
