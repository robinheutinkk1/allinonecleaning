import { MapPin, Sparkles } from "lucide-react";
import type { Project } from "@/config/projects";
import { BeforeAfterSlider } from "./BeforeAfterSlider";

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-navy-100">
      <BeforeAfterSlider
        beforeSrc={project.beforeImage}
        afterSrc={project.afterImage}
        beforeAlt={project.beforeAlt}
        afterAlt={project.afterAlt}
        priority={priority}
        rounded="rounded-none"
        className="shadow-none"
        sizes="(min-width: 1024px) 50vw, 100vw"
        trackId={project.slug}
      />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-aqua-100 px-3 py-1 text-aqua-800">{project.serviceLabel}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-3 py-1 text-navy-600">
            <MapPin className="size-3" aria-hidden />
            {project.location}
          </span>
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-navy-900">{project.title}</h3>
        {project.description && <p className="mt-2 text-sm leading-relaxed text-navy-500">{project.description}</p>}
        {project.result && (
          <p className="mt-4 flex items-start gap-2 rounded-2xl bg-aqua-50 p-3 text-sm text-navy-800">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-aqua-600" aria-hidden />
            <span>
              <span className="font-semibold">Resultaat: </span>
              {project.result}
            </span>
          </p>
        )}
      </div>
    </article>
  );
}
