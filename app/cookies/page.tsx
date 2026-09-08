import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Cookiebeleid",
  description: `Cookiebeleid van ${siteConfig.legalName}: welke cookies en opslag de website gebruikt en waarom.`,
  path: "/cookies",
});

/**
 * Cookiebeleid — CONCEPT. Werk bij zodra analytics (bijv. GA4/Plausible) wordt
 * toegevoegd; dan is mogelijk een cookiebanner met toestemming nodig.
 */
export default function CookiesPage() {
  return (
    <>
      <PageHeader title="Cookiebeleid" description="Hoe deze website omgaat met cookies en lokale opslag." breadcrumbs={[{ name: "Home", path: "/" }, { name: "Cookies", path: "/cookies" }]} />
      <section className="section-y bg-white">
        <div className="container-x">
          <article className="mx-auto max-w-3xl space-y-8 text-navy-700">
            <div>
              <h2 className="font-display text-2xl font-bold text-navy-900">Functionele opslag</h2>
              <p className="mt-3 leading-relaxed">
                Deze website gebruikt geen tracking-cookies. Wij gebruiken uitsluitend functionele opslag in uw browser (sessionStorage) om uw ingevulde gegevens in het
                offerteformulier tijdelijk te bewaren, zodat u niet opnieuw hoeft te beginnen als u per ongeluk de pagina ververst. Deze gegevens verlaten uw browser niet en
                worden automatisch gewist zodra u het tabblad sluit of de aanvraag verstuurt.
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-navy-900">Statistieken</h2>
              <p className="mt-3 leading-relaxed">
                [ANALYTICS] — Op dit moment worden geen analytische cookies geplaatst. Als wij in de toekomst bezoekersstatistieken gaan meten, passen wij dit beleid aan en vragen
                wij waar nodig eerst uw toestemming.
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-navy-900">Lettertypen en externe bronnen</h2>
              <p className="mt-3 leading-relaxed">
                Lettertypen worden door de website zelf geleverd (self-hosted); er worden geen verzoeken naar Google Fonts gedaan bij het laden van de pagina.
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-navy-900">Vragen</h2>
              <p className="mt-3 leading-relaxed">Vragen over cookies of privacy? Neem contact op via {siteConfig.email ?? "[E-MAILADRES]"}.</p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
