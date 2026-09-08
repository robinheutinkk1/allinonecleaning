"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/config/projects";
import { services } from "@/config/services";
import { cn } from "@/lib/utils/cn";
import { ProjectCard } from "./ProjectCard";

/** Galerij met filter per dienst (alleen diensten waarvoor projecten bestaan). */
export function ProjectGallery({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<string>("alle");

  const available = useMemo(() => {
    const present = new Set(projects.map((p) => p.service));
    return services.filter((s) => present.has(s.slug));
  }, [projects]);

  const visible = filter === "alle" ? projects : projects.filter((p) => p.service === filter);

  return (
    <div>
      {available.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projecten op dienst">
          {[{ slug: "alle", title: "Alle projecten" }, ...available].map((s) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => setFilter(s.slug)}
              aria-pressed={filter === s.slug}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                filter === s.slug ? "bg-navy-900 text-white shadow-soft" : "bg-navy-50 text-navy-700 hover:bg-navy-100",
              )}
            >
              {s.title}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-navy-200 p-10 text-center text-navy-500">Nog geen projecten in deze categorie.</p>
      ) : (
        <ul className="grid gap-8 lg:grid-cols-2">
          {visible.map((p, i) => (
            <li key={p.id}>
              <ProjectCard project={p} priority={i < 2} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
