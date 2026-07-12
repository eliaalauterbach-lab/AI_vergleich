import type { Industry, AgentSummary, LeaderboardEntry, PromptSummary } from "@/types";
import { INDUSTRIES, industryBySlug } from "./taxonomy";
import { INDUSTRY_CONTENT, type IndustryContent } from "./industry-content";
import { getAgents } from "./agents";
import { getLeaderboard } from "./leaderboard";
import { getPrompts } from "./prompts";

export interface IndustryPage {
  industry: Industry;
  content: IndustryContent;
  agents: AgentSummary[];
  models: LeaderboardEntry[];
  prompts: PromptSummary[];
}

export async function getIndustryPage(slug: string): Promise<IndustryPage | null> {
  const industry = industryBySlug(slug);
  if (!industry) return null;

  const content: IndustryContent =
    INDUSTRY_CONTENT[slug] ?? {
      intro: `${industry.description}. Hier findest du die passenden KI-Modelle und Agenten für ${industry.name}.`,
      highlights: [],
      taskSlugs: [],
      promptCategory: null,
    };

  const [agents, allModels, prompts] = await Promise.all([
    getAgents({ industry: slug }),
    getLeaderboard(),
    content.promptCategory ? getPrompts(content.promptCategory) : Promise.resolve([]),
  ]);

  return {
    industry,
    content,
    agents,
    models: allModels.slice(0, 3),
    prompts: prompts.slice(0, 3),
  };
}

export function getIndustrySlugs(): string[] {
  return INDUSTRIES.map((i) => i.slug);
}
