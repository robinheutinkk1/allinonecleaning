import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  inverted = false,
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  inverted?: boolean;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className={cn("eyebrow mb-4", inverted && "text-gold-300")}>
          <span className="inline-block h-px w-6 bg-current opacity-60" aria-hidden />
          {eyebrow}
        </p>
      )}
      <Tag
        className={cn(
          "font-display font-bold tracking-tight",
          Tag === "h1" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]",
          inverted ? "text-white" : "text-navy-900",
        )}
      >
        {title}
      </Tag>
      {description && (
        <div className={cn("mt-5 text-base leading-relaxed sm:text-lg", inverted ? "text-navy-200" : "text-navy-500")}>
          {description}
        </div>
      )}
    </div>
  );
}
