import { adaptiveAgent } from "./articles/adaptive-agent";
import { kbConflicts } from "./articles/kb-conflicts";
import { langsmithCost } from "./articles/langsmith-cost";
import { latency } from "./articles/latency";
import { memoryLeak } from "./articles/memory-leak";
import { procedures } from "./articles/procedures";
import { strictMypy } from "./articles/strict-mypy";

/**
 * Articles are plain data, rendered by `ArticleBody`. Inline text supports `code` spans and **bold**.
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "code"; lang: string; code: string; caption?: string }
  | { type: "callout"; text: string }
  | { type: "quote"; text: string }
  | { type: "stats"; items: { label: string; value: string; note?: string }[] }
  | { type: "steps"; caption?: string; items: { name: string; kind: "llm" | "tool" | "logic"; note?: string }[] };

export type Article = {
  slug: string;
  title: string;
  description: string;
  published: string; // YYYY-MM-DD
  tags: string[];
  /** Drafts render in `next dev` only, so they can be reviewed before going live. */
  draft?: boolean;
  body: Block[];
};

export const articles: Article[] = [
  latency,
  adaptiveAgent,
  procedures,
  memoryLeak,
  langsmithCost,
  kbConflicts,
  strictMypy,
]
  .filter((a) => !a.draft || process.env.NODE_ENV !== "production")
  .sort((a, b) => b.published.localeCompare(a.published));

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

const WORDS_PER_MINUTE = 220;

export function readingMinutes(article: Article) {
  const words = article.body
    .flatMap((b) => {
      switch (b.type) {
        case "list":
          return b.items;
        case "code":
          return [b.code];
        case "stats":
          return b.items.map((i) => `${i.label} ${i.value} ${i.note ?? ""}`);
        case "steps":
          return b.items.map((i) => `${i.name} ${i.note ?? ""}`);
        default:
          return [b.text];
      }
    })
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
