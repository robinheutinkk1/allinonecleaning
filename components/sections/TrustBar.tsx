import { Check } from "lucide-react";
import { trustItems } from "@/config/site";

export function TrustBar() {
  return (
    <section aria-label="Waarom All in One Cleaning" className="relative z-10 border-b border-navy-100 bg-white">
      <div className="container-x">
        <ul className="grid grid-cols-2 divide-navy-100 lg:grid-cols-4 lg:divide-x">
          {trustItems.map((item) => (
            <li key={item.label} className="flex items-start gap-3 py-5 pr-4 lg:px-6 lg:py-6 lg:first:pl-0 lg:last:pr-0">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-aqua-100 text-aqua-700">
                <Check className="size-3.5" strokeWidth={3} aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-semibold text-navy-900 sm:text-[15px]">{item.label}</span>
                <span className="mt-0.5 hidden text-xs text-navy-400 sm:block">{item.description}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
