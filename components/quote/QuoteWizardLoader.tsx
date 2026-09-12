"use client";

import dynamic from "next/dynamic";

/**
 * De wizard wordt alleen client-side geladen: hij leest sessionStorage
 * (concept-herstel) en de URL, en heeft geen SEO-waarde. De paginatitel en
 * intro worden wél server-side gerenderd.
 */
const QuoteWizard = dynamic(() => import("./QuoteWizard").then((m) => m.QuoteWizard), {
  ssr: false,
  loading: () => <WizardSkeleton />,
});

export function QuoteWizardLoader() {
  return <QuoteWizard />;
}

export function WizardSkeleton() {
  return (
    <div className="animate-pulse rounded-4xl bg-white shadow-lift ring-1 ring-navy-100" aria-hidden>
      <div className="border-b border-navy-100 px-8 py-5">
        <div className="h-4 w-32 rounded bg-navy-100" />
        <div className="mt-3 h-2 w-full rounded-full bg-navy-100" />
      </div>
      <div className="space-y-4 px-8 py-10">
        <div className="h-8 w-2/3 rounded bg-navy-100" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-navy-50" />
          ))}
        </div>
      </div>
    </div>
  );
}
