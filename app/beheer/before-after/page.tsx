import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, PageTitle } from "@/components/admin/ui";
import { DemoHint } from "@/components/demo-admin/ui";
import { BeforeAfterPreview } from "@/components/demo-admin/BeforeAfterPreview";

export const metadata: Metadata = { title: "Before & After" };

export default function DemoBeforeAfterPage() {
  return (
    <>
      <DemoHint />
      <PageTitle
        title="Before & After"
        description="Zo ziet de vergelijkingsslider eruit op de website. Foto's en teksten beheert u bij Projecten."
        action={
          <Link href="/beheer/projecten" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-navy-200 bg-white px-4 text-sm font-semibold text-navy-800 hover:bg-navy-50 sm:min-h-10">
            Projecten beheren
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      />
      <Card>
        <BeforeAfterPreview />
      </Card>
    </>
  );
}
