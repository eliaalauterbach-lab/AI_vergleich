import { Check, X } from "lucide-react";
import type { ProCon } from "@/types";

/** Stärken/Schwächen in zwei Spalten (grün/rot). */
export function ProsCons({ items }: { items: ProCon[] }) {
  const pros = items.filter((i) => i.kind === "pro");
  const cons = items.filter((i) => i.kind === "con");

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Column title="Stärken" color="text-emerald-400" icon={<Check size={13} />} items={pros} />
      <Column title="Schwächen" color="text-rose-400" icon={<X size={13} />} items={cons} />
    </div>
  );
}

function Column({
  title,
  color,
  icon,
  items,
}: {
  title: string;
  color: string;
  icon: React.ReactNode;
  items: ProCon[];
}) {
  return (
    <div className="card p-4">
      <h3 className={`mb-3 text-sm font-semibold ${color}`}>{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-subtle">
            <span className={`mt-0.5 shrink-0 ${color}`}>{icon}</span>
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
