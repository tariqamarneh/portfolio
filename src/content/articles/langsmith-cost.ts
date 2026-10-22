import type { Article } from "../writing";

export const langsmithCost: Article = {
  slug: "cutting-langsmith-tracing-costs",
  title: "Cutting LangSmith costs without going blind",
  description:
    "Half our traces came from tests, and the rest carried the same graph state five times. Four small changes, and how we kept every trace our evals and support team rely on.",
  seoDescription:
    "Half our LangSmith traces came from tests, and the rest repeated the same graph state. Four small changes cut the bill and kept every trace our evals rely on.",
  published: "2026-10-18",
  tags: ["LangSmith", "Observability", "LangGraph", "Cost"],
  body: [
    {
      type: "p",
      text: "LangSmith bills per trace, and our renewal was coming up at a much higher list price. Turning tracing off wasn't an option: our nightly regression suite grades agent conversations from their traces, and support links every conversation to its trace. So the question was which traces we actually needed, and how much of each one.",
    },
    {
      type: "p",
      text: "Before changing anything I broke trace volume down by source. Two findings did most of the work:",
    },
    {
      type: "stats",
      items: [
        { label: "Traces from tests", value: "~49%", note: "unit tests in CI and local pytest runs" },
        { label: "Spans per trace", value: "42", note: "average production trace after trimming" },
        { label: "Worker sample rate", value: "1%", note: "deterministic, keyed on the trace ID" },
      ],
    },
    { type: "h2", text: "1. Tests stop tracing by default" },
    {
      type: "p",
      text: "Unit tests in CI were sending traces to an old default project, and every developer's local pytest run went to a personal project. Nobody looked at either. The fix was a few lines in `conftest.py` and removing one flag from the CI workflow. The regression tiers that grade traces opt back in explicitly:",
    },
    {
      type: "code",
      lang: "python",
      code: `# tests/conftest.py
_GRADES_TRACES = any(
    os.getenv(flag) == "1"
    for flag in ("RUN_HEALTHCARE_REGRESSIONS", "RUN_WORKFLOW_REGRESSIONS")
)
if not _GRADES_TRACES:
    os.environ["LANGSMITH_TRACING"] = "false"`,
    },
    {
      type: "p",
      text: "I also flipped the application default from \"trace unless told otherwise\" to \"don't trace unless configured\", so a new environment can't start billing by accident.",
    },
    { type: "h2", text: "2. Trim traces at export time" },
    {
      type: "p",
      text: "A LangGraph trace mirrors the call stack, and much of that stack is plumbing: prompt wrappers, cost trackers, fallback wrappers, `__start__` nodes and routers. Worse, many spans copied the whole graph state that the parent span already held. I didn't want to touch the agent code for this, so the trimming happens in a `langsmith.Client` subclass that rewrites runs on their way out:",
    },
    {
      type: "list",
      items: [
        "**Collapse** wrapper spans with no data of their own. Their children are re-parented by rewriting `parent_run_id` and `dotted_order`, so the tree still reads correctly. A bounded LRU of collapsed span IDs keeps memory capped.",
        "**Drop** subtrees nobody reads, such as structured-output parsing internals.",
        "**Summarize** payloads that duplicate the graph state: strings are cut to 1,000 characters, dicts and lists become `<N keys>` or `<N items>`, other objects become their type name.",
      ],
    },
    {
      type: "code",
      lang: "python",
      code: `class TrimmingClient(langsmith.Client):
    def create_run(self, *, name, inputs=None, **kw):
        if self._collapsed(name, kw):      # plumbing span: skip it,
            return                         # its children get re-parented
        super().create_run(name=name, inputs=self._trim(name, inputs), **kw)

    def update_run(self, run_id, *, outputs=None, **kw):
        if self._is_collapsed(run_id):
            return
        super().update_run(run_id, outputs=self._trim_outputs(run_id, outputs), **kw)

# installed once per worker process, after fork
ls.configure(client=TrimmingClient())`,
      caption: "Simplified. The real version keeps an allowlist of span names, and the re-parenting logic.",
    },
    {
      type: "callout",
      text: "Trim only what nothing reads. Our regression graders read the parser's **output**, so for that span only the inputs are summarized. Check what your evals depend on before you cut.",
    },
    { type: "h2", text: "3. Sample the background worker, deterministically" },
    {
      type: "p",
      text: "Background jobs, like scoring finished sessions, ran at high volume and were rarely opened. They're a good fit for sampling, but not with the SDK's built-in random rate. That drops traces silently, and the product shows a link to each conversation's trace. A random drop means a link to a trace that doesn't exist.",
    },
    {
      type: "p",
      text: "Instead, the decision is a pure function of the trace ID. Every span in a trace agrees on it, and the code that publishes trace links can ask the same question before publishing one:",
    },
    {
      type: "code",
      lang: "python",
      code: `def trace_is_sampled(trace_id: str, rate: float) -> bool:
    return uuid.UUID(trace_id).int % 10_000 < rate * 10_000

# before exposing a link to support / the product
sampled = trace_is_sampled(trace_id, settings.LANGSMITH_SAMPLE_RATE)
link = trace_url(trace_id) if sampled else None`,
    },
    {
      type: "p",
      text: "The worker runs at 1%. The production API that handles live conversations isn't sampled at all; it gets the trimming and keeps every trace.",
    },
    { type: "h2", text: "4. Find traces that shouldn't be roots" },
    {
      type: "p",
      text: "Each trace is billed by its root. Some code paths, like a background job that decides to skip a session, made traced API calls *outside* any parent trace, so each call became a billable trace of its own. About 42% of those skip events created one. Wrapping them in `tracing_context(enabled=False)` removed them without losing anything anyone looked at.",
    },
    { type: "h2", text: "Results" },
    {
      type: "list",
      items: [
        "Test traces went from about half of all volume to zero per day in CI.",
        "The worker dropped to roughly 300 traces a day, with no broken trace links.",
        "Production traces kept 100% coverage, now averaging 42 spans and under 1 MB each.",
        "The nightly regression suite and support's trace links work exactly as before.",
      ],
    },
    { type: "h2", text: "Takeaways" },
    {
      type: "list",
      items: [
        "Break volume down by source before optimizing. The biggest win was traffic nobody needed.",
        "If anything links to traces, sample deterministically, and let the linker ask the sampler.",
        "Trim at the client boundary, not in application code, so agents stay readable and the policy lives in one place.",
        "Know which traces your evals and people read, and protect those first.",
      ],
    },
  ],
};
