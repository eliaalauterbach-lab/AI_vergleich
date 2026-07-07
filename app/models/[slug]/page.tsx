import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Cpu, Gauge, ScrollText, Coins } from "lucide-react";
import { getModel, getAllModelSlugs } from "@/lib/data/models";
import { StarRating } from "@/components/ui/StarRating";
import { ProsCons } from "@/components/models/ProsCons";
import { BenchmarkList } from "@/components/models/BenchmarkList";
import { CostCalculator } from "@/components/models/CostCalculator";
import { RateModel } from "@/components/models/RateModel";
import { getUser, isAuthEnabled } from "@/lib/auth";
import {
  formatPrice,
  formatTps,
  formatTokens,
  modalityLabel,
  licenseLabel,
} from "@/lib/format";

export async function generateStaticParams() {
  const slugs = await getAllModelSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const model = await getModel(params.slug);
  if (!model) return { title: "Modell nicht gefunden" };
  return {
    title: `${model.name} – Steckbrief & Benchmarks`,
    description:
      model.description ?? `Details, Benchmarks und Community-Bewertung zu ${model.name}.`,
  };
}

export default async function ModelPage({ params }: { params: { slug: string } }) {
  const [model, user] = await Promise.all([getModel(params.slug), getUser()]);
  if (!model) notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-white"
      >
        <ArrowLeft size={15} />
        Zurück zur Rangliste
      </Link>

      {/* -------------------- Kopf -------------------- */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">{model.name}</h1>
            <span className="chip">{licenseLabel(model.license)}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
            <span>{model.provider_name ?? "—"}</span>
            <span className="text-border">·</span>
            <span>{model.modalities.map(modalityLabel).join(" / ")}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StarRating value={model.rating_avg} count={model.rating_count} size={18} />
          {model.performance_score != null && (
            <span className="text-sm text-muted">
              Performance-Score{" "}
              <strong className="text-accent-soft">{model.performance_score.toFixed(0)}</strong>/100
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        {/* -------------------- Hauptspalte -------------------- */}
        <div className="space-y-6">
          {model.description && (
            <section className="card p-5">
              <p className="leading-relaxed text-subtle">{model.description}</p>
            </section>
          )}

          <section>
            <SectionTitle>Stärken &amp; Schwächen</SectionTitle>
            <ProsCons items={model.pros_cons} />
          </section>

          <section className="card p-5">
            <SectionTitle>Benchmarks</SectionTitle>
            <BenchmarkList scores={model.scores} />
          </section>

          <section className="card p-5">
            <SectionTitle>Community-Bewertung</SectionTitle>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold tabular-nums text-white">
                {model.rating_avg.toFixed(1)}
              </span>
              <div>
                <StarRating value={model.rating_avg} size={18} />
                <p className="mt-1 text-sm text-muted">
                  aus {model.rating_count} Bewertungen
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <RateModel slug={model.slug} canRate={!!user} authEnabled={isAuthEnabled()} />
            </div>
          </section>
        </div>

        {/* -------------------- Seitenleiste -------------------- */}
        <aside className="space-y-4">
          <div className="card p-5">
            <SectionTitle>Eckdaten</SectionTitle>
            <dl className="space-y-3 text-sm">
              <Fact icon={<Cpu size={14} />} label="Kontextfenster" value={`${formatTokens(model.context_window)} Tokens`} />
              <Fact icon={<Coins size={14} />} label="Preis Input" value={`${formatPrice(model.price_input_usd)} / 1M`} />
              <Fact icon={<Coins size={14} />} label="Preis Output" value={`${formatPrice(model.price_output_usd)} / 1M`} />
              <Fact icon={<Gauge size={14} />} label="Durchsatz" value={formatTps(model.throughput_tps)} />
              <Fact icon={<ScrollText size={14} />} label="Lizenz" value={licenseLabel(model.license)} />
            </dl>
          </div>

          <CostCalculator
            priceInput={model.price_input_usd}
            priceOutput={model.price_output_usd}
            throughputTps={model.throughput_tps}
          />
        </aside>
      </div>
    </main>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">{children}</h2>;
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="flex items-center gap-2 text-muted">
        {icon}
        {label}
      </dt>
      <dd className="font-medium tabular-nums text-subtle">{value}</dd>
    </div>
  );
}
