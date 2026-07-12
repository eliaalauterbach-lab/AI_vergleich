import {
  Code, Megaphone, Scale, HeartPulse, Landmark, GraduationCap, Palette,
  TrendingUp, Headset, Users, FlaskConical, ShoppingCart, Clapperboard,
  Building2, PenLine, Image, Video, Music, Search, BarChart3, Workflow,
  MessageSquare, Languages, Presentation, Boxes, type LucideIcon,
} from "lucide-react";

/** Namens-basierte Lucide-Icons für die Taxonomie (Branchen & Aufgaben). */
const ICONS: Record<string, LucideIcon> = {
  Code, Megaphone, Scale, HeartPulse, Landmark, GraduationCap, Palette,
  TrendingUp, Headset, Users, FlaskConical, ShoppingCart, Clapperboard,
  Building2, PenLine, Image, Video, Music, Search, BarChart3, Workflow,
  MessageSquare, Languages, Presentation,
};

export function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const Cmp = ICONS[name] ?? Boxes;
  return <Cmp size={size} />;
}
