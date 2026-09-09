import { Camera, ClipboardCheck, FileText, Sparkles } from "lucide-react";
import { DrawLine, Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    n: "01",
    title: "Aanvraag",
    text: "U vult in twee minuten de offertewizard in en stuurt een paar foto's mee van de situatie.",
    icon: Camera,
  },
  {
    n: "02",
    title: "Beoordeling",
    text: "Wij bekijken uw foto's en gegevens en nemen contact met u op als we nog iets willen weten.",
    icon: ClipboardCheck,
  },
  {
    n: "03",
    title: "Offerte",
    text: "U ontvangt een duidelijke, transparante offerte op maat. Geen verrassingen achteraf.",
    icon: FileText,
  },
  {
    n: "04",
    title: "Reiniging",
    text: "Na akkoord plannen we de werkzaamheden in. We reinigen met lage druk en controleren het resultaat samen met u.",
    icon: Sparkles,
  },
];

export function ProcessSteps() {
  return (
    <section className="section-y bg-navy-water relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-grid-faint [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]" aria-hidden />
      <div className="container-x relative">
        <Reveal>
          <SectionHeading
            eyebrow="Zo werken wij"
            title="Van aanvraag tot schone gevel in vier stappen."
            description="Zo verloopt een aanvraag in grote lijnen. Elke situatie is anders. Daarom kijken we altijd eerst goed mee voordat we iets beloven."
            inverted
          />
        </Reveal>

        <StaggerGroup className="relative mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <DrawLine className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent lg:block" />
          {steps.map((s) => (
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
