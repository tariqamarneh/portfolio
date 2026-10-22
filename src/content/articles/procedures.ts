import type { Article } from "../writing";

export const procedures: Article = {
  slug: "compiling-plain-language-workflows",
  title: "Compiling plain-language workflows into graphs an agent can't wander off",
  description:
    "Businesses write their processes as sentences. A compiler turns them into a control-flow graph, and a deterministic runtime only asks the LLM four narrow questions.",
  seoDescription:
    "Businesses write their processes as sentences. A compiler turns them into a control-flow graph, and a deterministic runtime asks the LLM four narrow questions.",
  published: "2026-10-18",
  tags: ["LangGraph", "Compilers", "AI agents", "Product"],
  body: [
    {
      type: "p",
      text: "Every business has processes its WhatsApp agent should follow exactly: check an order before offering a refund, collect three details before booking, hand off to a human when a payment fails. Prompting an agent with \"please follow these steps\" works in a demo and drifts in production. A step gets skipped, a condition gets guessed, a write happens without confirmation.",
    },
    {
      type: "p",
      text: "Procedures (we called them AI Workflows while building them) take the opposite approach. Admins write the steps in plain language. Publishing compiles them into a graph. At run time, code walks the graph, and the LLM is only consulted where judgment is truly needed.",
    },
    {
      type: "quote",
      text: "The LLM decides what the customer meant. Code decides what happens next.",
    },
    { type: "h2", text: "What admins write" },
    {
      type: "p",
      text: "The editor is a document, not a flowchart. Typing `/` opens a palette of actions (read data, write data, ask the customer, hand off, run a sub-procedure, run code), and `@` inserts a variable. Conditions are written as branches whose test can be a sentence or a small code expression:",
    },
    {
      type: "code",
      lang: "procedure",
      code: `1. /read orders for @customer.phone -> @orders
   Ask which recent order they mean.  /ask pick @order from @orders
2. If @order.status is delivered:
     Tell them it arrived on @order.delivered_date.  /end
   Otherwise:
     /read shipment for @order -> @shipment
     Share the latest update and expected date.`,
      caption: "A simplified order-status procedure, as an admin would write it.",
    },
    { type: "h2", text: "The compiler" },
    {
      type: "p",
      text: "Publishing runs a pure compiler: no database, no LLM. It parses the document, builds a control-flow graph by walking the steps from last to first (each step joins the next, and the last joins an end node), then runs a series of checks. Errors carry step, branch and line coordinates, so the editor can underline the exact line.",
    },
    {
      type: "list",
      items: [
        "Every `@variable` is in scope where it's used, and list or field access matches its type.",
        "Sub-procedures can't recurse, and nesting is capped at five levels.",
        "Action inputs are complete, and inline code passes a sandbox check.",
        "**Every path reaches an end.** A conversation must never run out of steps halfway through.",
        "If a later branch checks whether an action failed, that action is marked to continue on error, so the author's branch handles it.",
      ],
    },
    {
      type: "p",
      text: "The output is a small IR: instruction nodes (a list of operations: do an action, say, ask, end, hand off), condition nodes with labelled arms, and an end node. It's stored next to the procedure with a compiler version, so old runs keep executing the graph they started on.",
    },
    { type: "h2", text: "The runtime: four questions for the LLM" },
    {
      type: "p",
      text: "Execution is a loop: evaluate the current node, then execute what it returns. The interpreter is pure by construction. Every side effect goes through an injected runtime, and the whole run state is a JSON dict that round-trips through Redis between WhatsApp messages. The LLM appears in exactly four places, each with a strict output schema:",
    },
    {
      type: "steps",
      caption: "The four LLM calls, each returning structured output.",
      items: [
        {
          name: "dispatch",
          kind: "llm",
          note: "Is this message an answer to our question, a new request, several requests, a change to an earlier answer, or a request to stop?",
        },
        {
          name: "judge",
          kind: "llm",
          note: "Pick one branch label, or `none` or `unknown`. Only called after code and rule branches fail to match.",
        },
        {
          name: "intake",
          kind: "llm",
          note: "Read the customer's reply as an answer, or as yes/no for a confirmation. A tapped WhatsApp list item is matched exactly first, with no model call.",
        },
        {
          name: "say",
          kind: "llm",
          note: "Phrase the step's text in the business's voice. If phrasing fails, the author's text is sent as written.",
        },
      ],
    },
    {
      type: "p",
      text: "Everything else is code: walking edges, scoping variables, calling actions, deciding when to pause for the customer. A few rules made it trustworthy:",
    },
    {
      type: "list",
      items: [
        "**Writes always ask first.** The payload is frozen in run state until the customer says yes. A no ends the run cleanly.",
        "**\"Can't tell\" is never \"no\".** If the judge returns `unknown`, the customer is asked once; a second `unknown` hands off to a human instead of silently taking a branch.",
        "**Failures don't pass silently.** A failed action hands off, unless the author wrote a branch that checks for it.",
        "**Runs survive republishing.** A run is pinned to the version it started on, and unpublishing creates a new draft rather than pulling the graph from under live conversations.",
      ],
    },
    { type: "h2", text: "Testing it like a compiler and like a product" },
    {
      type: "p",
      text: "The compiler and interpreter have ordinary unit tests, because they're pure functions. The harder question is whether the four LLM calls behave, so procedures got their own tier in our nightly regression suite: 22 scripted conversations, 49 turns across four procedures, graded from each turn's trace. A case expects a trajectory, which steps ran and where the run stopped, rather than exact wording. Expected results are written from the spec, never copied from a run, and the verdict lands in Slack every morning.",
    },
    { type: "h2", text: "What I'd keep" },
    {
      type: "list",
      items: [
        "Put the LLM behind narrow, typed questions. Four small prompts are far easier to evaluate than one big \"follow the procedure\" prompt.",
        "Compile early. Most bad procedures are caught at publish time, with a red underline, instead of in a customer conversation.",
        "Keep the interpreter pure and its state serializable. It makes multi-day WhatsApp conversations, retries and tests simple.",
        "Grade trajectories, not phrasing. Wording changes every model release; the path through the graph shouldn't.",
      ],
    },
  ],
};
