import Link from "next/link";
import { ComponentPropsWithoutRef, ElementType, ReactElement, ReactNode } from "react";

type ButtonProps<T extends ElementType = "button"> = {
  asChild?: boolean;
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost";
} & ComponentPropsWithoutRef<T>;

const baseClassName =
  "inline-flex items-center justify-center rounded-2xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-60";

const variantClassNames = {
  primary: "bg-accent text-slate-950 hover:bg-accentSoft",
  secondary: "border border-border bg-panelAlt text-foreground hover:bg-panel",
  ghost: "text-foreground hover:bg-panelAlt",
};

const sizeClassNames = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-6 text-base",
};

export function Button<T extends ElementType = "button">({
  asChild,
  children,
  className = "",
  size = "md",
  variant = "primary",
  ...props
}: ButtonProps<T>) {
  const classNames = `${baseClassName} ${variantClassNames[variant]} ${sizeClassNames[size]} ${className}`.trim();

  if (asChild && isLinkChild(children)) {
    return (
      <Link
        href={children.props.href}
        className={classNames}
        {...(props as Omit<ComponentPropsWithoutRef<"a">, "children">)}
      >
        {children.props.children}
      </Link>
    );
  }

  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  );
}

function isLinkChild(
  child: ReactNode,
): child is ReactElement<{ href: string; children: ReactNode }> {
  return child !== null && typeof child === "object" && "props" in child && "type" in child;
}
