import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacyverklaring",
  description: `Privacyverklaring van ${siteConfig.legalName}: welke gegevens wij verzamelen via de website en het offerteformulier en hoe wij daarmee omgaan.`,
  path: "/privacy",
});

/**
 * Privacyverklaring - CONCEPT.
 * Laat deze tekst controleren en aanvullen door het bedrijf (en indien gewenst
 * een jurist). Velden tussen [ ] moeten worden ingevuld.
 */
export default function PrivacyPage() {
  const lastUpdated = "[DATUM]";
  return (
    <>
      <PageHeader title="Privacyverklaring" description={`Laatst bijgewerkt: ${lastUpdated}`} breadcrumbs={[{ name: "Home", path: "/" }, { name: "Privacyverklaring", path: "/privacy" }]} />
      <section className="section-y bg-white">
        <div className="container-x">
          <article className="prose-legal mx-auto max-w-3xl space-y-8 text-navy-700">
            <div>
              <h2 className="font-display text-2xl font-bold text-navy-900">1. Wie zijn wij</h2>
              <p className="mt-3 leading-relaxed">
                {siteConfig.legalName}, gevestigd in {siteConfig.address.city}
                {siteConfig.kvk ? ` (KvK ${siteConfig.kvk})` : " ([KVK-NUMMER])"}, is verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven in deze
                privacyverklaring. Contact: {siteConfig.email ?? "[E-MAILADRES]"}.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-navy-900">2. Welke gegevens wij verwerken</h2>
              <p className="mt-3 leading-relaxed">Wij verwerken alleen gegevens die u zelf aan ons verstrekt via het offerteformulier of het contactformulier:</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-6">
                <li>Naam, telefoonnummer en e-mailadres</li>
                <li>Postcode, huisnummer en plaats van de locatie waar de werkzaamheden plaatsvinden</li>
                <li>Informatie over de gewenste dienst, het pand, de omvang en de vervuiling</li>
                <li>Foto&apos;s die u uploadt van de te reinigen situatie</li>
                <li>Uw opmerkingen of bericht</li>
                <li>Technische gegevens: een gehashte (niet-herleidbare) versie van uw IP-adres en het type browser, ter voorkoming van misbruik</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-navy-900">3. Waarvoor wij uw gegevens gebruiken</h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-6">
                <li>Het beoordelen van uw aanvraag en het opstellen van een offerte</li>
                <li>Contact met u opnemen over uw aanvraag of bericht</li>
                <li>Het uitvoeren en administreren van de overeengekomen werkzaamheden</li>
                <li>Het beveiligen van onze website tegen misbruik</li>
              </ul>
              <p className="mt-3 leading-relaxed">
                Grondslag: uitvoering van een (mogelijke) overeenkomst en ons gerechtvaardigd belang bij een goed werkende, veilige website. Wij gebruiken uw gegevens niet voor
                geautomatiseerde besluitvorming en verkopen ze nooit aan derden.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-navy-900">4. Foto&apos;s</h2>
              <p className="mt-3 leading-relaxed">
                Foto&apos;s die u via het offerteformulier uploadt, worden opgeslagen in een beveiligde, niet-openbare opslag. Metadata (zoals GPS-locatie) wordt bij het uploaden
                verwijderd. Uw foto&apos;s worden uitsluitend gebruikt om uw aanvraag te beoordelen en worden niet op onze website of social media gepubliceerd, tenzij u daar
                uitdrukkelijk toestemming voor geeft.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-navy-900">5. Bewaartermijn</h2>
              <p className="mt-3 leading-relaxed">
                Wij bewaren uw aanvraag en foto&apos;s niet langer dan nodig is voor het doel waarvoor ze zijn verzameld: [BEWAARTERMIJN, bijv. 12 maanden na afronding van de
                aanvraag]. Gegevens die wij wettelijk moeten bewaren (zoals facturen) bewaren wij gedurende de wettelijke termijn van 7 jaar.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-navy-900">6. Met wie wij gegevens delen</h2>
              <p className="mt-3 leading-relaxed">Wij maken gebruik van de volgende verwerkers, die uw gegevens uitsluitend namens ons verwerken:</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-6">
                <li>Onze database- en opslagleverancier (opslag van aanvragen en foto&apos;s op servers in de EU)</li>
                <li>Onze hostingleverancier (het draaien van de website)</li>
                <li>Onze e-maildienst (versturen van bevestigingen en meldingen)</li>
              </ul>
              <p className="mt-3 leading-relaxed">Met deze partijen zijn verwerkersovereenkomsten gesloten of zij hanteren standaardvoorwaarden die aan de AVG voldoen.</p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-navy-900">7. Uw rechten</h2>
              <p className="mt-3 leading-relaxed">
                U heeft het recht om uw persoonsgegevens in te zien, te corrigeren of te laten verwijderen. Ook kunt u bezwaar maken tegen de verwerking of vragen om
                gegevensoverdracht. Stuur uw verzoek naar {siteConfig.email ?? "[E-MAILADRES]"}; vermeld daarbij uw aanvraagnummer als u dat heeft. Wij reageren binnen de
                wettelijke termijn. U kunt ook een klacht indienen bij de Autoriteit Persoonsgegevens.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-navy-900">8. Beveiliging</h2>
              <p className="mt-3 leading-relaxed">
                Wij nemen passende technische en organisatorische maatregelen: versleutelde verbindingen (HTTPS), beveiligde opslag met toegangsbeperking, server-side
                validatie en beperking van het aantal aanvragen per bezoeker.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-navy-900">9. Wijzigingen</h2>
              <p className="mt-3 leading-relaxed">Wij kunnen deze privacyverklaring aanpassen. De meest recente versie vindt u altijd op deze pagina.</p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
