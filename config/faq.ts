/**
 * Veelgestelde vragen. Antwoorden zijn gebaseerd op de werkwijze van de site
 * en op wat All in One Cleaning zelf over de reinigingsmethode communiceert
 * (allinone-cleaning.nl). Geen prijzen of garanties die niet bevestigd zijn.
 */
export type FaqItem = { question: string; answer: string };

export const faqItems: FaqItem[] = [
  {
    question: "Hoe vraag ik een offerte aan?",
    answer:
      "Via de knop 'Gratis offerte aanvragen' doorloopt u in ongeveer twee minuten een korte vragenlijst: wat u wilt laten reinigen, om wat voor pand het gaat, hoe de vervuiling eruitziet en waar de klus zich bevindt. Daarna nemen wij contact met u op. Bellen kan natuurlijk ook.",
  },
  {
    question: "Gebruiken jullie een hogedrukreiniger?",
    answer:
      "Nee. Wij reinigen met lage druk in combinatie met biologisch afbreekbare reinigingsmiddelen. Hogedruk of stoom kan voegen uitblazen en het oppervlak van stenen, dakpannen en beplating beschadigen. Met onze methode verwijderen we algen, schimmel, mos en aanslag zonder dat risico.",
  },
  {
    question: "Kan ik foto's meesturen?",
    answer:
      "Ja, graag zelfs. In de offerteaanvraag kunt u tot acht foto's toevoegen, ook direct vanaf uw telefoon. Met een paar foto's kunnen wij de situatie veel beter beoordelen en u een passende offerte doen.",
  },
  {
    question: "Krijg ik direct een prijs te zien?",
    answer:
      "Nee. Elke gevel, elk dak en elk oppervlak is anders. Wij beoordelen uw aanvraag en foto's persoonlijk en sturen daarna een duidelijke offerte op maat, zonder verrassingen achteraf.",
  },
  {
    question: "Voor wie werken jullie?",
    answer:
      "Voor particulieren, bedrijven, instellingen en VvE's. Van een rijtjeswoning tot een bedrijfspand, school of appartementencomplex.",
  },
  {
    question: "Waar zijn jullie actief?",
    answer:
      "Wij werken vanuit Enschede en zijn actief in Enschede en de omliggende regio. Twijfelt u of uw locatie binnen ons werkgebied valt? Vraag gerust een offerte aan of neem contact op.",
  },
  {
    question: "Wat gebeurt er met mijn foto's en gegevens?",
    answer:
      "Uw foto's en gegevens gebruiken wij uitsluitend om uw aanvraag te beoordelen en contact met u op te nemen. Ze worden niet openbaar gemaakt. Lees meer in onze privacyverklaring.",
  },
];
