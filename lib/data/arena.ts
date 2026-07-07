import type { ArenaBattle, ArenaEloEntry } from "@/types";

/**
 * Blind-Test-Arena.
 * Liefert Beispiel-Duelle und die Elo-Rangliste. In Produktion werden die
 * Antworten live von den Modell-APIs erzeugt und Votes über `arena_matches`
 * gespeichert (anonym erlaubt); ein Cron-Batch berechnet daraus `model_elo`.
 */
export async function getBattles(): Promise<ArenaBattle[]> {
  return DEMO_BATTLES;
}

export async function getArenaElo(): Promise<ArenaEloEntry[]> {
  return [...DEMO_ARENA_ELO].sort((a, b) => b.rating - a.rating);
}

const DEMO_ARENA_ELO: ArenaEloEntry[] = [
  { slug: "claude-opus", name: "Claude Opus", provider_name: "Anthropic", rating: 1287, games: 8421 },
  { slug: "gpt-flagship", name: "GPT Flagship", provider_name: "OpenAI", rating: 1265, games: 9103 },
  { slug: "gemini-pro", name: "Gemini Pro", provider_name: "Google", rating: 1248, games: 7788 },
  { slug: "mistral-large", name: "Mistral Large", provider_name: "Mistral AI", rating: 1198, games: 4210 },
  { slug: "llama-large", name: "Llama Large", provider_name: "Meta", rating: 1176, games: 5344 },
];

const DEMO_BATTLES: ArenaBattle[] = [
  {
    id: "b1",
    category_name: "Text",
    prompt: "Erkläre einem 10-Jährigen in 3 Sätzen, warum der Himmel blau ist.",
    a: {
      slug: "claude-opus",
      name: "Claude Opus",
      response:
        "Sonnenlicht sieht weiß aus, besteht aber eigentlich aus allen Farben des Regenbogens. Wenn es durch die Luft fliegt, wird das blaue Licht am stärksten in alle Richtungen verstreut, weil es in kleinen Wellen schwingt. Deshalb kommt aus jeder Ecke des Himmels blaues Licht zu deinen Augen – und der Himmel wirkt blau.",
    },
    b: {
      slug: "llama-large",
      name: "Llama Large",
      response:
        "Der Himmel ist blau wegen der Luft. Das Sonnenlicht trifft auf die Luft und wird blau. Darum sehen wir oben blau.",
    },
  },
  {
    id: "b2",
    category_name: "Code",
    prompt: "Schreibe eine JavaScript-Funktion, die prüft, ob ein Wort ein Palindrom ist.",
    a: {
      slug: "gpt-flagship",
      name: "GPT Flagship",
      response:
        "function istPalindrom(wort) {\n  const bereinigt = wort.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return bereinigt === [...bereinigt].reverse().join('');\n}\n\n// Ignoriert Groß-/Kleinschreibung und Sonderzeichen.\n// istPalindrom('Reliefpfeiler') // true",
    },
    b: {
      slug: "mistral-large",
      name: "Mistral Large",
      response:
        "function istPalindrom(wort) {\n  return wort === wort.split('').reverse().join('');\n}\n\n// Prüft das Wort direkt (achtet auf Groß-/Kleinschreibung).",
    },
  },
  {
    id: "b3",
    category_name: "Marketing",
    prompt: "Schreibe einen kurzen, knackigen Slogan für eine nachhaltige Kaffeemarke.",
    a: {
      slug: "gemini-pro",
      name: "Gemini Pro",
      response: "„Guter Kaffee, gutes Gewissen – Genuss, der die Welt ein bisschen besser macht.\"",
    },
    b: {
      slug: "claude-opus",
      name: "Claude Opus",
      response: "„Jeder Schluck zählt. Für dich. Für die Bohne. Für den Planeten.\"",
    },
  },
  {
    id: "b4",
    category_name: "Research",
    prompt: "Nenne in einem Satz den Hauptunterschied zwischen Korrelation und Kausalität.",
    a: {
      slug: "mistral-large",
      name: "Mistral Large",
      response:
        "Korrelation bedeutet, dass zwei Dinge gemeinsam auftreten, während Kausalität bedeutet, dass das eine das andere tatsächlich verursacht.",
    },
    b: {
      slug: "gpt-flagship",
      name: "GPT Flagship",
      response:
        "Korrelation heißt nur, dass zwei Variablen zusammenhängen; Kausalität heißt, dass die eine die andere direkt bewirkt – Zusammenhang ist also nicht gleich Ursache.",
    },
  },
];
