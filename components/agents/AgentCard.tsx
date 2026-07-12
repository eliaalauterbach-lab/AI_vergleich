import Link from "next/link";
import { Bot } from "lucide-react";
import type { AgentSummary } from "@/types";
import { StarRating } from "@/components/ui/StarRating";
import { pricingLabel } from "@/lib/format";

/** Kompakte Agenten-Kachel für Verzeichnis, Suche und Branchen-Seiten. */
export function AgentCard({ agent }: { agent: AgentSummary }) {
  return (
    <Link
      href={`/agents/${agent.slug}`}
      className="card group flex flex-col p-4 transition-colors hover:border-accent/40 hover:bg-elevate"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-dim text-accent-soft">
            <Bot size={16} />
          </span>
          <span className="font-semibold text-foreground transition-colors group-hover:text-accent-soft">
            {agent.name}
          </span>
        </span>
        <span className="chip">{agent.agent_type}</span>
      </div>

      <p className="line-clamp-2 text-sm text-muted">{agent.tagline}</p>

      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
        <StarRating value={agent.rating_avg} count={agent.rating_count} size={13} />
        <span className="shrink-0 rounded-full bg-elevate px-2 py-0.5 text-xs text-muted">
          {pricingLabel(agent.pricing)}
        </span>
      </div>
    </Link>
  );
}
