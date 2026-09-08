import { Building2, Home, Layers, Sun, MoreHorizontal, type LucideProps } from "lucide-react";

const icons = {
  building: Building2,
  home: Home,
  layers: Layers,
  sun: Sun,
  more: MoreHorizontal,
} as const;

export type ServiceIconName = keyof typeof icons;

export function ServiceIcon({ name, ...props }: { name: ServiceIconName } & LucideProps) {
  const Icon = icons[name] ?? MoreHorizontal;
  return <Icon aria-hidden {...props} />;
}
