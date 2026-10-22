import type { Article } from "../writing";

export const adaptiveAgent: Article = {
  slug: "one-agent-for-every-business",
  title: "One agent for every kind of business",
  description:
    "Instead of a new agent per industry, each business describes its world as a schema, and a single LangGraph agent reads it. How the schema, the graph and the write safety net fit together.",
  seoDescription:
    "Instead of a new agent per industry, each business describes its world as a schema and one LangGraph agent reads it. How the schema, graph and safety net fit.",
  published: "2026-10-18",
  tags: ["LangGraph", "AI agents", "Architecture", "Kotlin"],
  body: [
    {
      type: "p",
      text: "The first time a platform adds an AI agent for a new industry, it's tempting to build a dedicated graph: clinic logic for clinics, salon logic for salons. That works for one vertical. By the third, you're maintaining three agents that solve the same problems slightly differently: understanding what the customer is talking about, narrowing it down, checking availability, and making sure nothing gets booked by mistake.",
    },
    {
      type: "p",
      text: "I started the adaptive agent to solve those problems once. Each business describes its world as a schema, and one agent reads it. Healthcare is the first vertical running on it in production, but nothing in the engine knows what a doctor is.",
    },
    {
      type: "quote",
      text: "The engine knows about entities, links and outcomes. Only the schema knows they're doctors, branches and appointments.",
    },
    { type: "h2", text: "The schema: dimensions, relationships, outcomes" },
    {
      type: "list",
      items: [
        "**Dimensions** are the things a customer can mention: a location, a staff member, a service. Each has typed fields, and some fields are marked as disambiguators.",
        "**Relationships** are directed links between dimensions, such as staff `works_at` location. Some describe what a thing is; others describe how the business operates.",
        "**Outcomes** are what the agent can do: list available slots, book, reserve, purchase, or capture a lead. Each declares its required fields, the endpoint that performs it, what it produces, and whether it writes.",
      ],
    },
    {
      type: "code",
      lang: "json",
      code: `{
  "dimensions": [
    { "id": "LOCATION",
      "fields": [{ "key": "name", "type": "text" },
                 { "key": "city", "type": "enum" }] },
    { "id": "STAFF",
      "fields": [{ "key": "name", "type": "text" }] }
  ],
  "relationships": [
    { "from": "STAFF", "to": "LOCATION",
      "name": "works_at", "inverse": "staffed_by" }
  ],
  "outcomes": [
    { "id": "LIST_SLOTS",
      "fields": [{ "key": "STAFF", "type": "dimension" }],
      "endpoint": "list_slots",
      "produces": ["SLOT"],
      "writeOperation": false },
    { "id": "BOOK", "type": "book",
      "fields": [{ "key": "SLOT", "type": "dimension" },
                 { "key": "name", "type": "text" }],
      "endpoint": "create_booking",
      "writeOperation": true }
  ]
}`,
      caption: "A made-up schema in the same shape. A clinic, a salon and a car-service centre differ only in this file.",
    },
    { type: "h2", text: "Where the schema comes from" },
    {
      type: "p",
      text: "Businesses don't write this by hand. Their systems already expose a catalog, and different businesses expose different things: one has branches, practitioners, services and specialties, another only services and practitioners. So I built two pieces on the platform side:",
    },
    {
      type: "list",
      items: [
        "A **generic entity-and-relation store** (Kotlin, Spring Boot, PostgreSQL). Catalog changes arrive as Pub/Sub events and are stored as typed entities and n-ary relations. Relations have deterministic keys and no foreign keys, so a relation simply lights up once all its participants have arrived, whatever order events come in.",
        "A **schema translator** running as a Cloud Run Job. It builds dimensions and outcomes deterministically from the provider's catalog shape, and uses an LLM only for the judgment calls: inferring relationships, spotting enums, flagging dimensions customers tend to confuse, and drafting routing guidance. Fields a business has tuned by hand survive re-translation.",
      ],
    },
    { type: "h2", text: "The graph" },
    {
      type: "steps",
      caption: "One graph for every business. LLM nodes make judgments; code does the rest.",
      items: [
        { name: "guard", kind: "llm", note: "spam, escalation rules, out-of-scope messages; fails open" },
        { name: "capability_router", kind: "llm", note: "picks an outcome, or clarify / unsupported / escalate" },
        { name: "mentions", kind: "llm", note: "what the customer named or described, including \"not that one\"" },
        { name: "resolve", kind: "logic", note: "match mentions against the business's entities" },
        { name: "agent loop", kind: "tool", note: "resolve, options, status, live lookup, commit… capped at 12 hops" },
        { name: "answer", kind: "llm" },
        { name: "final_review", kind: "llm", note: "checks every reply against guardrails; one retry on violation" },
      ],
    },
    { type: "h2", text: "Asking the right clarifying question" },
    {
      type: "p",
      text: "\"I want to see Dr. Ahmad\" might match four people. A model can ask \"which one?\", but a good question splits the candidates. Disambiguation is deterministic: it finds the fields and links that differ between the candidates, then picks the one that splits them most evenly. If two are tied, a link (\"at which branch?\") beats a raw field. WhatsApp lists are capped at a handful of rows, so when there are more options the agent has to narrow first rather than dump a long list.",
    },
    { type: "h2", text: "Nothing writes without a yes" },
    {
      type: "p",
      text: "The most important rule is about writes. Every outcome declares `writeOperation`, and when that's missing it defaults to true, so an unknown action is treated as dangerous. When the agent calls `commit` on a write, the provider isn't called. The parameters and a human-readable summary are frozen into session state, and the customer is asked to confirm.",
    },
    {
      type: "list",
      items: [
        "Only an explicit confirmation on the next turn releases the write, and it replays the frozen payload before any model runs, so the model can't change the details between asking and booking.",
        "A Redis lock and a fingerprint of the write make it idempotent: a duplicate \"yes\" returns `already_completed`, and a newer request supersedes the pending one.",
      ],
    },
    {
      type: "callout",
      text: "Default to the safe interpretation. A new outcome that forgets to say whether it writes still asks the customer first.",
    },
    { type: "h2", text: "Onboarding a business" },
    {
      type: "p",
      text: "Adding a business is now configuration: its catalog syncs into the entity store, the translator publishes a schema, and the agent picks it up. The same engine also runs written procedures and multi-intent messages, and a nightly regression suite grades over a hundred scripted healthcare conversations from their traces.",
    },
    { type: "h2", text: "What I'd keep" },
    {
      type: "list",
      items: [
        "Push domain knowledge into data, and keep the engine ignorant of it. It's the only way the third vertical costs less than the first.",
        "Let the LLM extract and judge; let code resolve, disambiguate and gate. The deterministic parts are the ones you can test exhaustively.",
        "Freeze what you're about to write, and replay exactly that after confirmation.",
        "Use an LLM in the offline pipeline (the translator) where its mistakes can be reviewed, not in the live write path.",
      ],
    },
    {
      type: "p",
      text: "This was a team effort: I started the engine and built its schema pipeline, disambiguation, routing, guard, final review and write gate, alongside teammates who built large parts of the runtime and the evaluation suite.",
    },
  ],
};
