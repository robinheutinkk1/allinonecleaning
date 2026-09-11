/**
 * Veelgestelde vragen van het demobedrijf NOVA Onderhoud.
 * Wordt ook gebruikt voor de FAQ-structured data op de homepage.
 */
export type FaqItem = { question: string; answer: string };

export const faqItems: FaqItem[] = [
  {
    question: "Welke werkzaamheden voeren jullie uit?",
    answer:
      "Reiniging van gevels, daken, zonnepanelen en bestrating, schilderwerk binnen en buiten, houtrotherstel, periodiek onderhoud en renovatie. Kortom: het complete onderhoud van een woning of bedrijfspand, door één team. Twijfelt u of uw klus erbij hoort? Kies in de offerteaanvraag voor 'Anders' en omschrijf het kort.",
  },
  {
    question: "Hoe vraag ik een offerte aan?",
    answer:
      "Klik op 'Offerte aanvragen' en beantwoord een paar korte vragen: wat er moet gebeuren, om wat voor pand het gaat en wat de huidige situatie is. Foto's toevoegen kan direct vanaf uw telefoon. U ontvangt meteen een aanvraagnummer en wij nemen daarna contact met u op voor een persoonlijke beoordeling.",
  },
  {
    question: "Krijg ik direct een prijs te zien?",
    answer:
      "Nee. Elk pand en elke klus is anders, dus we beoordelen uw aanvraag en foto's eerst persoonlijk. Daarna ontvangt u een duidelijke offerte op maat, zonder verrassingen achteraf. De aanvraag is gratis en vrijblijvend.",
  },
  {
    question: "Is reinigen veilig voor mijn gevel, dak of panelen?",
    answer:
      "Ja. We kiezen per oppervlak de passende methode: gecontroleerde druk, milieubewuste middelen en de juiste apparatuur. Zo verdwijnt de aanslag, maar blijven voegen, coatings en oppervlakken intact. Zonnepanelen reinigen we met zacht water, zonder krassen.",
  },
  {
    question: "Kan ik foto's meesturen?",
    answer:
      "Graag zelfs. In de offerteaanvraag kunt u tot acht foto's toevoegen, ook rechtstreeks met de camera van uw telefoon. Een overzichtsfoto en een close-up van de situatie helpen ons om een goede inschatting te maken.",
  },
  {
    question: "Kunnen jullie reiniging en schilderwerk combineren?",
    answer:
      "Zeker. Veel klanten laten de gevel of het houtwerk eerst reinigen en daarna schilderen of herstellen. Wij plannen dat als één traject, met één aanspreekpunt en één planning.",
  },
  {
    question: "Voor wie werken jullie?",
    answer: "Voor particulieren, bedrijven, verhuurders en VvE's. Van een rijtjeswoning tot een bedrijfspand of appartementencomplex.",
  },
  {
    question: "Waar zijn jullie actief?",
    answer:
      "NOVA Onderhoud werkt voor particuliere en zakelijke klanten in Twente en omgeving, onder andere in Hengelo, Borne, Enschede, Oldenzaal en Almelo. Ligt uw pand net buiten dit gebied? Vraag gerust een offerte aan, dan kijken we wat mogelijk is.",
  },
  {
    question: "Wat gebeurt er met mijn foto's en gegevens?",
    answer:
      "Uw foto's en gegevens gebruiken wij uitsluitend om uw aanvraag te beoordelen en contact met u op te nemen. Ze worden afgeschermd opgeslagen en nooit openbaar gemaakt. Lees meer in onze privacyverklaring.",
  },
];
