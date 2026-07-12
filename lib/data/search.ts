import type { LeaderboardEntry, AgentSummary } from "@/types";
import { getLeaderboard } from "./leaderboard";
import { getAgents, DEMO_AGENTS } from "./agents";
import { TASK_TO_MODALITY } from "./taxonomy";

export interface SearchResult {
  models: LeaderboardEntry[];
  agents: AgentSummary[];
}

/**
 * Durchsucht Modelle & Agenten nach Freitext, Branche und/oder Aufgabe.
 * Modelle (LLMs) sind branchenübergreifend nutzbar → bei Branchenfilter werden
 * die Top-Allrounder gezeigt; bei Aufgabenfilter nach Modalität eingegrenzt.
 */
export async function search(params: {
  q?: string;
  industry?: string;
  task?: string;
}): Promise<SearchResult> {
  const { q, industry, task } = params;
  const query = q?.trim().toLowerCase();

  const [allModels, allAgents] = await Promise.all([
    getLeaderboard(),
    getAgents({ industry, task }),
  ]);

  // --- Modelle ---
  let models = allModels;
  if (task && TASK_TO_MODALITY[task]) {
    const mod = TASK_TO_MODALITY[task];
    models = models.filter((m) => m.modalities.includes(mod as never));
  }
  if (query) {
    models = models.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        (m.provider_name?.toLowerCase().includes(query) ?? false)
    );
  }
  // Bei reinem Branchenfilter: Top-Modelle als Allrounder (max 3)
  if (industry && !task && !query) {
    models = [...models].sort((a, b) => (b.performance_score ?? 0) - (a.performance_score ?? 0)).slice(0, 3);
  }

  // --- Agenten ---
  let agents = allAgents;
  if (query) {
    agents = DEMO_AGENTS.filter(
      (a) =>
        a.name.toLowerCase().includes(query) ||
        a.tagline.toLowerCase().includes(query) ||
        a.agent_type.toLowerCase().includes(query)
    );
    if (industry) agents = agents.filter((a) => a.industries.includes(industry));
    if (task) agents = agents.filter((a) => a.tasks.includes(task));
    agents = [...agents].sort((x, y) => y.rating_avg - x.rating_avg);
  }

  return { models, agents };
}
