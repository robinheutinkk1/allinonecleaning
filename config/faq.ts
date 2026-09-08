/**
 * Veelgestelde vragen. Alleen antwoorden die feitelijk kloppen voor de
 * werkwijze van deze site. Geen technische of commerciële beloften.
 */
export type FaqItem = { question: string; answer: string };

export const faqItems: FaqItem[] = [
  {
    question: "Hoe vraag ik een offerte aan?",
    answer:
      "Via de knop 'Gratis offerte aanvragen' doorloopt u in ongeveer twee minuten een korte vragenlijst: wat u wilt laten reinigen, om wat voor pand het gaat, hoe de vervuiling eruitziet en waar de klus zich bevindt. Daarna nemen wij contact met u op.",
  },
  {
    question: "Kan ik foto's meesturen?",
    answer:
      "Ja, graag zelfs. In de offerteaanvraag kunt u tot acht foto's toevoegen, ook direct vanaf uw telefoon. Met een paar foto's kunnen wij de situatie veel beter beoordelen en u een passende offerte doen.",
  },
  {
    question: "Welke informatie hebben jullie nodig?",
    answer:
      "Wat u wilt laten reinigen, het type pand, een indicatie van de omvang, hoe de vervuiling eruitziet, de locatie en uw contactgegevens. Weet u iets niet zeker? Kies dan 'Weet ik niet', dan beoordelen wij het samen met u.",
  },
  {
    question: "Krijg ik direct een prijs te zien?",
    answer:
      "Nee. Elke gevel, dak of oppervlak is anders. Wij beoordelen uw aanvraag en foto's persoonlijk en nemen daarna contact met u op met een offerte die past bij uw situatie.",
  },
  {
    question: "Waar zijn jullie actief?",
    answer:
      "Wij werken vanuit Enschede en zijn actief in Enschede en omgeving. Twijfelt u of uw locatie binnen ons werkgebied valt? Vraag gerust een offerte aan of neem contact op.",
  },
  {
    question: "Wat gebeurt er met mijn foto's en gegevens?",
    answer:
      "Uw foto's en gegevens gebruiken wij uitsluitend om uw aanvraag te beoordelen en contact met u op te nemen. Ze worden niet openbaar gemaakt. Lees meer in onze privacyverklaring.",
  },
];
