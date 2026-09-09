import { Building2, Hammer, HardHat, Home, Layers, LayoutGrid, MoreHorizontal, Paintbrush, Ruler, Sun, type LucideProps } from "lucide-react";

const icons = {
  building: Building2,
  home: Home,
  layers: Layers,
  sun: Sun,
  grid: LayoutGrid,
  paintbrush: Paintbrush,
  hammer: Hammer,
  ruler: Ruler,
  hardhat: HardHat,
  more: MoreHorizontal,
} as const;

export type ServiceIconName = keyof typeof icons;

export function ServiceIcon({ name, ...props }: { name: ServiceIconName } & LucideProps) {
  const Icon = icons[name] ?? MoreHorizontal;
  return <Icon aria-hidden {...props} />;
}
