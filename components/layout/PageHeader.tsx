import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** Lichte paginakop voor alle pagina's behalve de homepage (navbar is daar solid). */
export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: { name: string; path: string }[];
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("bg-water relative overflow-hidden pb-14 pt-32 sm:pb-16 sm:pt-40", className)}>
      <div className="pointer-events-none absolute -right-32 -top-20 size-96 rounded-full bg-aqua-200/50 blur-3xl" aria-hidden />
      <div className="container-x relative">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Kruimelpad" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-navy-500">
              {breadcrumbs.map((b, i) => {
                const last = i === breadcrumbs.length - 1;
                return (
                  <li key={b.path} className="flex items-center gap-1.5">
                    {last ? (
                      <span aria-current="page" className="font-medium text-navy-800">
                        {b.name}
                      </span>
                    ) : (
                      <Link href={b.path} className="transition-colors hover:text-navy-900">
                        {b.name}
                      </Link>
                    )}
                    {!last && <ChevronRight className="size-3.5 text-navy-300" aria-hidden />}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}
        {eyebrow && (
          <p className="eyebrow mb-4">
            <span className="inline-block h-px w-6 bg-current opacity-60" aria-hidden />
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">{title}</h1>
        {description && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-navy-500">{description}</div>}
        {children}
      </div>
    </section>
  );
}
