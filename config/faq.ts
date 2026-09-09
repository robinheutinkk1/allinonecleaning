/**
 * Veelgestelde vragen. Antwoorden zijn gebaseerd op de werkwijze van de site,
 * de reinigingsmethode zoals het bedrijf die communiceert (lage druk, biologisch
 * afbreekbaar, geen hogedruk of stoom), het dienstenaanbod van het Trustoo-profiel
 * en de door het bedrijf bevestigde reiskostenregeling. Geen doorlooptijden of
 * garanties die niet bevestigd zijn.
 *
 * Wordt ook gebruikt voor de FAQ-structured data op de homepage.
 */
export type FaqItem = { question: string; answer: string };

export const faqItems: FaqItem[] = [
  {
    question: "Wat kunnen jullie allemaal voor mij doen?",
    answer:
      "Reiniging van gevels, dakpannen en dakgoten, trespa, zonnepanelen en bestrating. Daarnaast schilderwerk binnen en buiten, houtrotherstel, vloerwerk, renovatie en diverse onderhoudswerkzaamheden aan woningen en bedrijfspanden. Kortom: totaalonderhoud van gevel tot dak. Twijfelt u of uw klus erbij hoort? Kies in de offerteaanvraag voor 'Anders' en omschrijf het kort, of bel ons.",
  },
  {
    question: "Is reinigen veilig voor mijn gevel of dak?",
    answer:
      "Ja. Wij werken met lage druk in combinatie met biologisch afbreekbare reinigingsmiddelen. Hogedruk of stoom gebruiken wij niet: dat kan voegen uitblazen en het oppervlak van stenen, dakpannen en beplating beschadigen. Met onze methode verwijderen we algen, mos, schimmel en aanslag zonder dat risico.",
  },
  {
    question: "Hoe vraag ik een offerte aan?",
    answer:
      "Klik op 'Gratis offerte aanvragen'. In ongeveer twee minuten beantwoordt u een paar korte vragen: wat u wilt laten doen, om wat voor pand het gaat, wat de huidige situatie is en waar de klus is. U ontvangt direct een aanvraagnummer en wij nemen daarna contact met u op. Liever bellen? Dat kan natuurlijk ook.",
  },
  {
    question: "Krijg ik direct een prijs te zien?",
    answer:
      "Nee, en dat is bewust. Elke gevel, elk dak en elk terras is anders: het oppervlak, de mate van vervuiling en de bereikbaarheid bepalen het werk. Wij beoordelen uw aanvraag en foto's persoonlijk en sturen daarna een duidelijke offerte op maat, zonder verrassingen achteraf. De aanvraag is gratis en vrijblijvend.",
  },
  {
    question: "Kan ik foto's meesturen?",
    answer:
      "Ja, graag zelfs. In de offerteaanvraag kunt u tot acht foto's toevoegen, ook rechtstreeks met de camera van uw telefoon. Een overzichtsfoto en een close-up van de vervuiling zijn het handigst. Zo kunnen wij de situatie goed inschatten en u een passende offerte doen.",
  },
  {
    question: "Hoe vaak moet een gevel of dak gereinigd worden?",
    answer:
      "Dat verschilt per situatie. Een gevel of dak op de noordzijde, in de schaduw of dicht bij bomen vergroent sneller dan een zonnige, open kant. Vaste termijnen geven we daarom niet; bij de offerte adviseren we wat voor uw pand verstandig is.",
  },
  {
    question: "Waarom zonnepanelen laten reinigen?",
    answer:
      "Stof, pollen, vogelpoep en groene aanslag houden zonlicht tegen en verlagen de opbrengst van uw panelen. Wij reinigen ze met lage druk en zonder agressieve middelen, zodat het glas en de coating onbeschadigd blijven.",
  },
  {
    question: "Voor wie werken jullie?",
    answer:
      "Voor particulieren, bedrijven, instellingen en VvE's. Van een rijtjeswoning of vrijstaand huis tot een bedrijfspand, school, zorginstelling of appartementencomplex.",
  },
  {
    question: "Waar zijn jullie actief?",
    answer:
      "Wij werken vanuit Enschede en zijn actief in heel Overijssel: van Twente tot Zwolle en van Deventer tot Hardenberg. Binnen 10 kilometer van Enschede rekenen wij geen reiskosten. Daarbuiten geldt een kilometervergoeding van 0,23 euro per kilometer, die wij vooraf duidelijk in de offerte opnemen.",
  },
  {
    question: "Rekenen jullie voorrijkosten?",
    answer:
      "Binnen 10 kilometer van Enschede niet. Ligt uw pand verder weg in Overijssel, dan rekenen wij 0,23 euro per gereden kilometer. Dat bedrag staat altijd apart en vooraf in de offerte, zodat u nooit voor verrassingen komt te staan.",
  },
  {
    question: "Wat gebeurt er met mijn foto's en gegevens?",
    answer:
      "Uw foto's en gegevens gebruiken wij uitsluitend om uw aanvraag te beoordelen en contact met u op te nemen. Foto's worden afgeschermd opgeslagen en nooit openbaar gemaakt. Lees meer in onze privacyverklaring.",
  },
];
