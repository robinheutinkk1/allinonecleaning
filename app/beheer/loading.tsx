/** Skelet dat direct verschijnt bij navigatie in de demo-beheeromgeving. */
export default function BeheerLoading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-live="polite">
      <div className="mb-6 space-y-2">
        <div className="h-8 w-48 rounded-lg bg-navy-100" />
        <div className="h-4 w-72 max-w-full rounded bg-navy-100/70" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-3xl bg-white ring-1 ring-navy-100" />
        ))}
      </div>
      <div className="mt-6 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 rounded-2xl bg-white ring-1 ring-navy-100" />
        ))}
      </div>
    </div>
  );
}
