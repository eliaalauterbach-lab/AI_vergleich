/** Kleine Formatierungs-Helfer für die UI. */

export function formatPrice(usd: number | null): string {
  if (usd == null) return "—";
  return `$${usd % 1 === 0 ? usd.toFixed(0) : usd.toFixed(2)}`;
}

export function formatTps(tps: number | null): string {
  if (tps == null) return "—";
  return `${Math.round(tps)} T/s`;
}

const MODALITY_LABEL: Record<string, string> = {
  text: "Text", code: "Code", image: "Bild", video: "Video",
  audio: "Audio", music: "Musik", research: "Research",
  marketing: "Marketing", multimodal: "Multimodal",
};

export const modalityLabel = (m: string): string => MODALITY_LABEL[m] ?? m;
