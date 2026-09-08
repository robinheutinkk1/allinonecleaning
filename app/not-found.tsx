import { ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ctaConfig } from "@/config/site";

export default function NotFound() {
  return (
    <section className="bg-water flex min-h-[80vh] items-center pt-24">
      <div className="container-x text-center">
        <p className="eyebrow justify-center">Pagina niet gevonden</p>
        <h1 className="mt-4 font-display text-5xl font-bold text-navy-900 sm:text-6xl">404</h1>
        <p className="mx-auto mt-4 max-w-md text-navy-500">Deze pagina bestaat niet (meer). Misschien is de link verouderd of verkeerd getypt.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/" variant="secondary" icon={<Home className="size-4" />} iconPosition="left">
            Naar de homepage
          </Button>
          <Button href={ctaConfig.primary.href} icon={<ArrowRight className="size-4" />}>
            {ctaConfig.primary.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
