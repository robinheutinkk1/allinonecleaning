import "server-only";
import { fallbackProjects, type Project } from "@/config/projects";
import { getService } from "@/config/services";
import { getAnonServerClient, STORAGE_BUCKETS } from "@/lib/supabase/server";
import type { ProjectRow } from "@/lib/supabase/types";

/**
 * Projecten (before/after) ophalen.
 * Volgorde: Supabase `projects` (published) → statische fallback uit config.
 */

function publicImageUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl) || pathOrUrl.startsWith("/")) return pathOrUrl;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return pathOrUrl;
  return `${base}/storage/v1/object/public/${STORAGE_BUCKETS.projectImages}/${pathOrUrl}`;
}

function rowToProject(row: ProjectRow): Project {
  const service = getService(row.service);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    service: row.service,
    serviceLabel: service?.title ?? row.service,
    location: row.location ?? "Regio Enschede",
    description: row.description ?? "",
    result: row.result ?? "",
    beforeImage: publicImageUrl(row.before_image),
    afterImage: publicImageUrl(row.after_image),
    beforeAlt: row.before_alt ?? `Voor: ${row.title}`,
    afterAlt: row.after_alt ?? `Na: ${row.title}`,
    featured: row.featured,
    sortOrder: row.sort_order,
    published: row.published,
  };
}

export async function getProjects(): Promise<Project[]> {
  const client = getAnonServerClient();
  if (!client) return fallbackProjects;

  try {
    const { data, error } = await client
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return fallbackProjects;
    return data.map(rowToProject);
  } catch {
    return fallbackProjects;
  }
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const all = await getProjects();
  const featured = all.filter((p) => p.featured);
  return (featured.length > 0 ? featured : all).slice(0, limit);
}

export async function getProjectsByService(serviceSlug: string): Promise<Project[]> {
  const all = await getProjects();
  return all.filter((p) => p.service === serviceSlug);
}
