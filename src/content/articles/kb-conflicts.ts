import type { Article } from "../writing";

export const kbConflicts: Article = {
  slug: "detecting-knowledge-base-conflicts",
  title: "When the knowledge base disagrees with itself",
  description:
    "Two FAQ articles give different prices, and the agent picks one. A parallel LLM step that catches contradictions in what was actually retrieved, and a review queue that lets the business fix the source.",
  seoDescription:
    "When two FAQ articles disagree, the agent picks one. A parallel LLM check catches contradictions in what was retrieved, and a review queue fixes the source.",
  published: "2026-10-18",
  tags: ["RAG", "LLM", "Product", "PostgreSQL"],
  body: [
    {
      type: "p",
      text: "Businesses upload their knowledge as FAQs, PDFs and web pages, and they rarely delete anything. Over time two articles start to disagree: an old price and a new one, last year's opening hours and this year's. Retrieval happily returns both, and the model picks one. The customer gets a confident, wrong answer, and nobody at the business ever learns the content is broken.",
    },
    {
      type: "p",
      text: "Scanning the whole knowledge base for contradictions is expensive and mostly finds pairs nobody ever asks about. So I flipped it around: check for conflicts only among the articles a real question actually retrieved, at the moment it retrieved them.",
    },
    { type: "h2", text: "A check that never slows the reply" },
    {
      type: "p",
      text: "After the reranker picks the articles for a turn, a separate LLM call looks at that selection for contradictions. It runs in parallel with answer generation, so it adds no latency, and it fails open: if it errors or times out, the turn simply records no conflicts.",
    },
    {
      type: "steps",
      caption: "Conflict detection runs beside the answer, never in front of it.",
      items: [
        { name: "retrieve → rerank", kind: "tool", note: "the articles chosen for this question" },
        { name: "answer generation", kind: "llm", note: "the customer's reply, unchanged" },
        { name: "conflict detection", kind: "llm", note: "in parallel: do any of these articles contradict each other?" },
        { name: "record", kind: "logic", note: "store the conflict and link it to the reply that was sent" },
      ],
    },
    {
      type: "list",
      items: [
        "It only runs when there are at least two articles, and looks at no more than twenty.",
        "It uses structured output, and may only cite article references it was actually given, so it can't invent a source.",
        "I kept it separate from the reranker on purpose. Asking one prompt to rank and to find contradictions made the ranking worse.",
      ],
    },
    { type: "h2", text: "Conflicts as data" },
    {
      type: "p",
      text: "A conflict is identified by its pair of articles, not by their content. A small edit to one of them doesn't reopen a pair someone already reviewed. Three tables hold the story:",
    },
    {
      type: "list",
      items: [
        "`kb_conflicts`: the pair, a short explanation, and a status of open, processed or dismissed.",
        "`kb_conflict_occurrences`: every time the conflict showed up, linked to the reply that was actually sent, so a reviewer can see the real impact.",
        "`kb_article_usage`: which articles the agent cited, taken from citation tags in its answers.",
      ],
    },
    { type: "h2", text: "Closing the loop with the business" },
    {
      type: "p",
      text: "Detection is only useful if someone fixes the content. The admin console has a review screen with Open, Resolved and Dismissed tabs. Resolving a conflict applies the edit or deletion to the articles involved and re-syncs the knowledge base, so the fix reaches retrieval immediately. Dismissing it records that the difference is intentional.",
    },
    {
      type: "callout",
      text: "The agent can't fix bad content, but it's in the best position to notice it. Give it a way to tell the people who can.",
    },
    { type: "h2", text: "Takeaways" },
    {
      type: "list",
      items: [
        "Check quality where it matters: on what real questions retrieve, not on the whole corpus.",
        "Side checks should run in parallel and fail open. They must never delay or break the reply.",
        "Constrain the model to cite only what it was given.",
        "Link each finding to its real-world impact, so the business knows which fixes matter first.",
      ],
    },
  ],
};
