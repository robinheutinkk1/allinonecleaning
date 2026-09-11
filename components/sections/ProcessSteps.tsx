import { Camera, ClipboardCheck, FileText, Sparkles } from "lucide-react";
import { DrawLine, Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const processSteps = [
  {
    n: "01",
    title: "Aanvraag",
    text: "U vertelt in een paar stappen wat er moet gebeuren en voegt eventueel foto's toe. Dat kost u ongeveer twee minuten.",
    icon: Camera,
  },
  {
    n: "02",
    title: "Beoordeling",
    text: "Wij bekijken uw foto's en gegevens en bellen als we nog iets willen weten. Bij grotere klussen komen we langs.",
    icon: ClipboardCheck,
  },
  {
    n: "03",
    title: "Offerte",
    text: "U ontvangt een duidelijke offerte op maat, met wat we doen, wanneer we komen en wat het kost.",
    icon: FileText,
  },
  {
    n: "04",
    title: "Uitvoering",
    text: "Na uw akkoord plannen we het werk in. We werken netjes en veilig en lopen het resultaat samen met u na.",
    icon: Sparkles,
  },
];

export function ProcessSteps({ compact = false }: { compact?: boolean }) {
  return (
    <section className="section-y bg-navy-water relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-grid-faint [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]" aria-hidden />
      <div className="container-x relative">
        {!compact && (
          <Reveal>
            <SectionHeading
              eyebrow="Zo werken wij"
              title="Van aanvraag tot oplevering in vier stappen."
              description="Duidelijk en zonder verrassingen. Elke situatie is anders, daarom kijken we altijd eerst goed mee voordat we iets beloven."
              inverted
            />
          </Reveal>
        )}

        <StaggerGroup className={`relative grid gap-8 md:grid-cols-2 lg:grid-cols-4 ${compact ? "" : "mt-14"}`}>
          <DrawLine className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent lg:block" />
          {processSteps.map((s) => (
            <StaggerItem key={s.n} className="relative">
              <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                <span className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
                  <s.icon className="size-6 text-gold-300" aria-hidden />
                  <span className="absolute -right-2 -top-2 rounded-full bg-gold-500 px-2 py-0.5 font-display text-[11px] font-bold text-navy-950">{s.n}</span>
                </span>
                <h3 className="font-display text-xl font-bold text-white lg:mt-6">{s.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-navy-200 lg:pr-4">{s.text}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
