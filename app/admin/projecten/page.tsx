import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { listProjects } from "@/lib/admin/queries";
import { FlagToggle } from "@/components/admin/ProjectRowActions";
import { EmptyState, Notice, PageTitle, btnPrimary } from "@/components/admin/ui";
import { getService } from "@/config/services";
import { fallbackProjects } from "@/config/projects";
import { getSupabaseUrl } from "@/lib/supabase/env";
import { STORAGE_BUCKETS } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Projecten" };

export default async function ProjectsPage({ searchParams }: PageProps<"/admin/projecten">) {
  await requireAdmin();
  const sp = await searchParams;
  const projects = await listProjects();
  const base = `${getSupabaseUrl()}/storage/v1/object/public/${STORAGE_BUCKETS.projectImages}`;
  const img = (p: string) => (/^https?:\/\//.test(p) || p.startsWith("/") ? p : `${base}/${p}`);

  return (
    <>
      <PageTitle
        title="Projecten"
        description="Before/after-projecten voor de galerij en de homepage."
        action={
          <Link href="/admin/projecten/nieuw" className={btnPrimary}>
            <Plus className="size-4" /> Nieuw project
          </Link>
        }
      />
      {sp.melding === "verwijderd" && (
        <div className="mb-4">
          <Notice>Project verwijderd.</Notice>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="space-y-4">
          <EmptyState
            title="Nog geen projecten in de database"
            text={`De website toont nu de ${fallbackProjects.length} vaste projecten uit de code. Zodra u hier een project publiceert, neemt de site de projecten uit het dashboard over.`}
            action={
              <Link href="/admin/projecten/nieuw" className={btnPrimary}>
                <Plus className="size-4" /> Eerste project toevoegen
              </Link>
            }
          />
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <li key={p.id} className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-navy-100">
              <Link href={`/admin/projecten/${p.id}`} className="grid grid-cols-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(p.before_image)} alt="Voor" className="aspect-[4/3] w-full object-cover" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(p.after_image)} alt="Na" className="aspect-[4/3] w-full object-cover" />
              </Link>
              <div className="p-4">
                <Link href={`/admin/projecten/${p.id}`} className="font-display font-bold text-navy-900 hover:underline">
                  {p.title}
                </Link>
                <p className="mt-0.5 text-xs text-navy-500">
                  {getService(p.service)?.title ?? p.service}
                  {p.location ? ` · ${p.location}` : ""} · volgorde {p.sort_order}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <FlagToggle id={p.id} field="published" value={p.published} label={p.published ? "Gepubliceerd" : "Verborgen"} />
                  <FlagToggle id={p.id} field="featured" value={p.featured} label={p.featured ? "Uitgelicht" : "Niet uitgelicht"} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
