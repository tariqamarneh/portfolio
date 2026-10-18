import type { Article } from "../writing";

export const latency: Article = {
  slug: "making-an-ai-agent-faster",
  title: "Taking an e-commerce agent from a minute to seconds",
  description:
    "Shoppers waited 50–80 seconds for an answer. Most of that wasn't thinking; it was round-trips the agent didn't need. What I moved out of the loop, ran in parallel, and put a timeout on.",
  published: "2026-10-18",
  draft: true,
  tags: ["LangGraph", "Latency", "RAG", "LangSmith"],
  body: [
    {
      type: "p",
      text: "On WhatsApp, a minute is long enough for a customer to give up and call the store. Our e-commerce agent was taking 50–80 seconds on many questions. After a series of changes, the same kinds of questions came back in 10–40 seconds. None of it came from a faster model. It came from reading traces and removing work the agent didn't need to do in sequence.",
    },
    {
      type: "stats",
      items: [
        { label: "Before", value: "50–80s", note: "typical turn on product and order questions" },
        { label: "After", value: "10–40s", note: "depending on the query" },
        { label: "Request timeout", value: "45s", note: "per LLM call, then retry and fall back" },
      ],
    },
    { type: "h2", text: "Read the trace before touching the code" },
    {
      type: "p",
      text: "Every turn is traced in LangSmith, so the first step was to open slow traces and look at their shape, not their total time. The pattern was consistent: the agent loop called a tool, waited, thought, called another tool, waited again. Each hop is an LLM call plus a network call, done one after the other. Knowledge-base search was one of those hops, and it ran on almost every turn.",
    },
    {
      type: "steps",
      caption: "Before: knowledge-base search was a tool the agent had to decide to call, inside its loop.",
      items: [
        { name: "guard → router", kind: "llm" },
        { name: "extract and resolve mentions", kind: "llm" },
        { name: "agent loop · think", kind: "llm" },
        { name: "agent loop · search_kb", kind: "tool", note: "another LLM decision, then a vector search" },
        { name: "agent loop · think again", kind: "llm" },
        { name: "answer → final review", kind: "llm" },
      ],
    },
    { type: "h2", text: "1. Fetch knowledge before the loop, in parallel" },
    {
      type: "p",
      text: "I removed the search tool from the loop and replaced it with one node that runs before it. The node runs two branches at once with `asyncio.gather`: one resolves the products or entities the customer mentioned and loads their FAQ articles directly from Postgres (no embedding call needed); the other generates a few search queries, runs the vector search, filters by score and reranks to the top four. The results are merged and deduplicated, then handed to the agent as context.",
    },
    {
      type: "code",
      lang: "python",
      code: `async def kb_context(state):
    entity_faqs, searched = await asyncio.gather(
        resolve_mentions_then_load_faqs(state),   # DB reads, no embeddings
        generate_queries_search_and_rerank(state),  # vector search, top 4
    )
    return {"kb_articles": dedupe(entity_faqs + searched)}`,
      caption: "Simplified. The agent now starts its loop already holding the knowledge it would have searched for.",
    },
    {
      type: "p",
      text: "Two caches stop the work from repeating within a conversation: articles already fetched for an entity aren't fetched again, and the rerank is skipped when the previous selection still fits. When I later added an LLM step that detects conflicting knowledge-base articles, it ran alongside the first branch rather than after it, so it added no time to the turn.",
    },
    { type: "h2", text: "2. Don't enter the loop when you already know the answer" },
    {
      type: "p",
      text: "Some turns don't need the agent loop at all. If a customer mentions a name that matches several products, the right reply is \"which one did you mean?\", and the mention-resolution step already knows that. Previously the loop would spin anyway; one trace showed it burning 15 seconds before ending with a vaguer question. Now the resolver exits directly to answer generation with the options, and questions the agent can't act on go to a light knowledge-base answer node outside the loop.",
    },
    { type: "h2", text: "3. Put a timeout on every model call" },
    {
      type: "p",
      text: "The worst turns weren't slow; they were stuck. LLM requests had no timeout, so when a provider froze, the turn waited, and the fallback models we had configured never got a chance to run. One call hung for 173 seconds until a test harness cancelled it. Each request now has a 45-second timeout and one retry before falling back. A healthy call takes about 2 seconds, and the slowest healthy ones about 30, so the timeout only catches calls that weren't going to finish.",
    },
    {
      type: "callout",
      text: "A fallback model without a timeout is decoration. If the primary call can hang forever, the fallback never runs.",
    },
    { type: "h2", text: "What I took away" },
    {
      type: "list",
      items: [
        "Look at the shape of slow traces, not just their duration. Sequential hops are the usual culprit.",
        "If the agent searches on almost every turn, searching isn't a decision. Do it before the loop, in parallel.",
        "Give deterministic code the chance to finish a turn before the agent loop starts.",
        "Timeouts are what make fallbacks work. Set them from what healthy calls look like.",
      ],
    },
  ],
};
