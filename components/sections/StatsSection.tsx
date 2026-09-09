import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteSettings } from "@/lib/settings";

/**
 * Statistieken uit het dashboard (Instellingen). Rendert alleen als er cijfers zijn ingevuld.
 */
export async function StatsSection() {
  const { stats } = await getSiteSettings();
  if (stats.length === 0) return null;

  return (
    <section className="border-y border-navy-100 bg-white py-12">
      <Reveal className="container-x">
        <dl className={`grid grid-cols-2 gap-8 ${stats.length >= 4 ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <dd className="font-display text-4xl font-bold text-navy-900 sm:text-5xl">
                <CountUp value={s.value} />
              </dd>
              <dt className="mt-2 text-sm text-navy-500">{s.label}</dt>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
