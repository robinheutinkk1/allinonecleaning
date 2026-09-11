import type { Metadata } from "next";
import { PageTitle } from "@/components/admin/ui";
import { DemoHint } from "@/components/demo-admin/ui";
import { ProjectsManager } from "@/components/demo-admin/ProjectsManager";

export const metadata: Metadata = { title: "Projecten" };

export default function DemoProjectsPage() {
  return (
    <>
      <DemoHint />
      <PageTitle title="Projecten" description="Voor-en-na-projecten op de pagina Ons werk. Gepubliceerde projecten zijn zichtbaar voor bezoekers." />
      <ProjectsManager />
    </>
  );
}
