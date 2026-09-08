import { Reveal } from "@/components/ui/Reveal";
import { stats } from "@/config/site";

/**
 * Statistieken - rendert ALLEEN als er echte cijfers in config/site.ts staan.
 * Geen "500+ klanten" zonder bewijs.
 */
export function StatsSection() {
  const real = stats.filter((s) => s.value);
  if (real.length === 0) return null;

  return (
    <section className="border-y border-navy-100 bg-white py-12">
      <Reveal className="container-x">
        <dl className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {real.map((s) => (
            <div key={s.label} className="text-center">
              <dd className="font-display text-4xl font-bold text-navy-900 sm:text-5xl">{s.value}</dd>
              <dt className="mt-2 text-sm text-navy-500">{s.label}</dt>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
