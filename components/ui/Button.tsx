import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "white" | "outline-white" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 ease-out-expo select-none whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-aqua-500 text-white shadow-[0_8px_24px_-8px_rgb(34_155_210_/_0.6)] hover:bg-aqua-600 hover:shadow-[0_12px_32px_-8px_rgb(34_155_210_/_0.7)] hover:-translate-y-0.5",
  secondary:
    "bg-navy-900 text-white hover:bg-navy-800 shadow-soft hover:shadow-lift hover:-translate-y-0.5",
  ghost:
    "bg-transparent text-navy-800 hover:bg-navy-50 border border-navy-200 hover:border-navy-300",
  white:
    "bg-white text-navy-900 shadow-soft hover:shadow-lift hover:-translate-y-0.5",
  "outline-white":
    "bg-white/5 text-white border border-white/30 backdrop-blur-sm hover:bg-white/12 hover:border-white/50",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-8 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
};

type ButtonAsButton = CommonProps & Omit<ComponentPropsWithoutRef<"button">, "children"> & { href?: undefined };
type ButtonAsLink = CommonProps & Omit<ComponentPropsWithoutRef<typeof Link>, "children"> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children, icon, iconPosition = "right", ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);
  const content = (
    <>
      {icon && iconPosition === "left" && <span className="shrink-0 transition-transform duration-300 group-hover/btn:-translate-x-0.5">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="shrink-0 transition-transform duration-300 group-hover/btn:translate-x-0.5">{icon}</span>}
    </>
  );

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...linkRest } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {content}
      </Link>
    );
  }
  const buttonRest = rest as ButtonAsButton;
  return (
    <button type="button" className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
