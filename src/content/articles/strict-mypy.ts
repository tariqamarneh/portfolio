import type { Article } from "../writing";

export const strictMypy: Article = {
  slug: "strict-mypy-on-a-live-ai-codebase",
  title: "1,901 type errors to zero on a live AI codebase",
  description:
    "Type checking had been switched off for a long time. How a shrinking baseline, a safety net of replay tests and import contracts got a fast-moving Python agent service to strict mypy, and the 15 real bugs it found.",
  seoDescription:
    "How a shrinking baseline, replay tests and import contracts took a fast-moving Python agent service to strict mypy, and the 15 real bugs it found.",
  published: "2026-10-18",
  tags: ["Python", "mypy", "Architecture", "Code quality"],
  body: [
    {
      type: "p",
      text: "Our AI engine is a fast-moving Python service: LangGraph agents, FastAPI, async database access, many contributors. Type checking had been tried before and switched off, and the Makefile still said \"temporarily disabled\". When the codebase started to feel hard to change, I listed what was actually wrong: a disabled checker, god modules, and packages importing each other in circles. The language wasn't the problem; discipline was.",
    },
    {
      type: "stats",
      items: [
        { label: "Type errors", value: "1,901 → 0", note: "across 271 modules" },
        { label: "Package cycles", value: "115 → 0", note: "enforced by import-linter in CI" },
        { label: "Latent bugs found", value: "15", note: "each fixed with a test" },
      ],
    },
    { type: "h2", text: "Step 0: a safety net before touching anything" },
    {
      type: "p",
      text: "A typing sweep across hundreds of files is a large refactor, and refactoring agents without tests is how you ship a bot that confidently says the wrong thing. Before fixing a single error I added:",
    },
    {
      type: "list",
      items: [
        "**Deterministic graph replay tests:** 25 scripted cases replayed deterministically through the real graph, so any behaviour change shows up as a diff.",
        "**Snapshots** of the graph topology and the OpenAPI schema, so a refactor can't quietly add a node or change an API.",
        "**import-linter**, so the layering rules could be checked in CI later.",
      ],
    },
    { type: "h2", text: "Step 1: a baseline that only shrinks" },
    {
      type: "p",
      text: "Turning on mypy across the whole codebase at once would have meant a frozen branch for weeks. Instead, mypy went into CI immediately, with an override listing the 274 modules that didn't pass yet:",
    },
    {
      type: "code",
      lang: "toml",
      code: `# Fix a module, then delete its line. Never add one.
[[tool.mypy.overrides]]
module = [
    "app.services.example_service",
    "app.graph.example_node",
    # … 272 more
]
ignore_errors = true`,
      caption: "New modules were strict from day one; old ones left the list as they were fixed.",
    },
    {
      type: "p",
      text: "Then the list was worked down to nothing in one large, mechanical PR: 283 files, every ORM model moved to SQLAlchemy's `Mapped[...]` (with identical generated DDL to prove nothing changed), stub packages added where they existed, and libraries without stubs collected into one explicit override. A week later `strict = true` and `warn_unreachable` were switched on. Session state and API boundaries got `TypedDict`s, with `@final` on tool results so an `in` check narrows the type.",
    },
    {
      type: "callout",
      text: "One LangGraph gotcha: a node factory typed as `Callable[[State], ...]` doesn't satisfy `add_node`'s protocol. Typing it as `Callable[..., Awaitable[X]]` does.",
    },
    { type: "h2", text: "The bugs mypy found" },
    {
      type: "p",
      text: "The most convincing argument for strict typing was the list of real bugs the baseline had been hiding:",
    },
    {
      type: "list",
      items: [
        "**Dead code that looked alive:** RTF text extraction always failed; an empty-reply fallback could never run; loading documents from URLs always returned an empty list.",
        "**Async cancellation:** `asyncio.CancelledError` isn't an `Exception`, so two `except Exception` handlers let it escape in ways nobody intended.",
        "**None where nobody expected it:** a missing message in conversation history, upload verification with no metadata returning a 500, deleting a file with no file ID.",
        "**Wrong shapes:** `.values()` called on a list; an endpoint returning `{}` where a list was required, causing a 422.",
        "**Caching a failure:** an empty speech-to-text result was cached as if it were a real transcript.",
        "**An unbound variable** on one branch of an event handler.",
      ],
    },
    { type: "h2", text: "Step 2: layers you can't cross" },
    {
      type: "p",
      text: "Types fix what a function promises. They don't stop an agent node from reaching straight into the database. For that, the layering is written down as import-linter contracts and checked on every PR:",
    },
    {
      type: "code",
      lang: "text",
      code: `routers → bootstrap → consumers → execution → graph
        → services → llm | integrations → infra → repositories → models

forbidden: graph ↛ repositories
acyclic:   no package import cycles anywhere in app/`,
    },
    {
      type: "p",
      text: "Getting there meant moving every query into repositories, deleting a database \"god class\", splitting a 618-line config module, and replacing 356 in-function imports, the usual workaround for import cycles. Layer violations went from 55 to 0, and package cycles from 115 to 0.",
    },
    { type: "h2", text: "Keeping it that way" },
    {
      type: "p",
      text: "The rules that stuck are short. No `ignore_errors`. No bare `# type: ignore`: each one names its error code and a reason. `cast` only for invariants that hold by construction. And most importantly: when a gate fails, fix the code; never widen the gate. Every allowlist only shrinks.",
    },
    {
      type: "list",
      items: [
        "Build the safety net first. Replay tests and snapshots made a 283-file PR reviewable.",
        "Use a baseline that can only shrink, so the checker protects new code from day one.",
        "Count the bugs you find. They're what convinces a team that strict typing pays for itself.",
        "Types and architecture rules are different tools. You want both in CI.",
      ],
    },
  ],
};
