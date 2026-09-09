import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { getProject } from "@/lib/admin/queries";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { Card, Notice, PageTitle } from "@/components/admin/ui";
import { getSupabaseUrl } from "@/lib/supabase/env";
import { STORAGE_BUCKETS } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Project" };

export default async function ProjectEditPage({ params, searchParams }: PageProps<"/admin/projecten/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;
  const project = id === "nieuw" ? null : await getProject(id);
  if (id !== "nieuw" && !project) notFound();
  const imageBase = `${getSupabaseUrl()}/storage/v1/object/public/${STORAGE_BUCKETS.projectImages}`;

  return (
    <>
      <Link href="/admin/projecten" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-500 hover:text-navy-900">
        <ArrowLeft className="size-4" /> Alle projecten
      </Link>
      <PageTitle title={project ? project.title : "Nieuw project"} description={project ? `Slug: ${project.slug}` : "Voeg een before/after-project toe met twee foto's."} />
      {sp.melding === "opgeslagen" && (
        <div className="mb-4">
          <Notice>Project opgeslagen en gepubliceerd naar de website.</Notice>
        </div>
      )}
      <Card>
        <ProjectForm project={project} imageBase={imageBase} />
      </Card>
    </>
  );
}
