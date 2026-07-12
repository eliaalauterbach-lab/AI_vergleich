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

const LICENSE_LABEL: Record<string, string> = {
  proprietary: "Proprietär",
  open_weight: "Open Weight",
  open_source: "Open Source",
  unknown: "Unbekannt",
};

export const licenseLabel = (l: string): string => LICENSE_LABEL[l] ?? l;

export function formatTokens(n: number | null): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)} Mio.`;
  if (n >= 1_000) return `${Math.round(n / 1000)}k`;
  return String(n);
}

const PRICING_LABEL: Record<string, string> = {
  free: "Kostenlos",
  freemium: "Freemium",
  paid: "Kostenpflichtig",
};

export const pricingLabel = (p: string): string => PRICING_LABEL[p] ?? p;
