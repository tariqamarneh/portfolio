// All editable site copy lives here.

export const profile = {
  name: "Tariq Amarneh",
  givenName: "Tariq",
  familyName: "Amarneh",
  siteUrl: "https://www.tariqamarneh.com",
  role: "Senior Software Engineer",
  company: "BusinessChat",
  location: "Amman, Jordan",
  intro:
    "I build AI agents that book appointments, track orders and follow business procedures over WhatsApp, in Arabic and English, and the backend services they run on.",
  email: "tariqs.naser@gmail.com",
  phoneDisplay: "+962 79 790 9969",
  phoneHref: "tel:+962797909969",
  whatsappHref: "https://wa.me/962797909969",
  linkedin: "https://www.linkedin.com/in/tariq-amarneh",
  github: "https://github.com/tariqamarneh",
  cv: "/Tariq-Amarneh-CV.pdf",
};

// ── Live trace demo ──────────────────────────────────────────────
export type TraceSpan = {
  name: string;
  detail: string;
  start: number; // ms from turn start
  duration: number; // ms
  depth: 0 | 1 | 2;
  kind: "llm" | "tool" | "logic";
};

export type TraceScenario = {
  id: string;
  label: string;
  short: string;
  customer: { text: string; dir: "rtl" | "ltr"; gloss?: string };
  reply: { text: string; dir: "rtl" | "ltr"; gloss?: string };
  spans: TraceSpan[];
};

export const scenarios: TraceScenario[] = [
  {
    id: "health",
    label: "Book a doctor",
    short: "Clinic",
    customer: {
      text: "بدي موعد عند دكتور أسنان بكرا الصبح",
      dir: "rtl",
      gloss: "I need a dentist appointment tomorrow morning",
    },
    reply: {
      text: "في ٣ مواعيد بكرا الصبح عند د. ليث في فرع عبدون: ٩:٠٠، ٩:٣٠، ١١:١٥. أي واحد بناسبك؟",
      dir: "rtl",
      gloss: "Dr. Laith has 3 slots tomorrow morning at the Abdoun branch: 9:00, 9:30, 11:15. Which works for you?",
    },
    spans: [
      { name: "guard", detail: "safe · in scope", start: 0, duration: 380, depth: 0, kind: "llm" },
      { name: "capability_router", detail: "→ adaptive: CREATE_BOOKING", start: 380, duration: 620, depth: 0, kind: "llm" },
      { name: "adaptive_agent", detail: "healthcare vertical", start: 1000, duration: 2900, depth: 0, kind: "logic" },
      { name: "mentions", detail: "specialty=dentistry · when=tomorrow AM", start: 1060, duration: 700, depth: 1, kind: "llm" },
      { name: "resolve", detail: "1 specialty · 2 doctors · 1 branch", start: 1780, duration: 260, depth: 1, kind: "tool" },
      { name: "live_lookup", detail: "availability API · 3 slots", start: 2060, duration: 1050, depth: 1, kind: "tool" },
      { name: "options", detail: "WhatsApp list · 3 rows", start: 3130, duration: 180, depth: 2, kind: "logic" },
      { name: "answer", detail: "Levantine Arabic", start: 3320, duration: 560, depth: 1, kind: "llm" },
      { name: "final_review", detail: "grounded · pass", start: 3920, duration: 430, depth: 0, kind: "llm" },
    ],
  },
  {
    id: "commerce",
    label: "Track an order",
    short: "Order",
    customer: { text: "Hey, where's my order #48213? It was due yesterday", dir: "ltr" },
    reply: {
      text: "Order #48213 left the Amman hub this morning and is out for delivery, expected before 6 PM today. Sorry it's a day late. I've flagged the delay so the shipping fee is refunded.",
      dir: "ltr",
    },
    spans: [
      { name: "guard", detail: "safe · in scope", start: 0, duration: 340, depth: 0, kind: "llm" },
      { name: "capability_router", detail: "→ order_status", start: 340, duration: 520, depth: 0, kind: "llm" },
      { name: "order_status", detail: "store integration", start: 860, duration: 1600, depth: 0, kind: "logic" },
      { name: "lookup_order", detail: "#48213 · out_for_delivery", start: 900, duration: 740, depth: 1, kind: "tool" },
      { name: "track_shipment", detail: "carrier · 4 events", start: 1660, duration: 520, depth: 1, kind: "tool" },
      { name: "answer", detail: "English · empathetic", start: 2200, duration: 600, depth: 1, kind: "llm" },
      { name: "final_review", detail: "grounded · pass", start: 2820, duration: 380, depth: 0, kind: "llm" },
    ],
  },
  {
    id: "procedure",
    label: "Run a procedure",
    short: "Procedure",
    customer: {
      text: "I want to return the jacket I bought last week, it's too small",
      dir: "ltr",
    },
    reply: {
      text: "No problem. Your jacket is still within the 14-day return window. Would you like to swap it for a size L, or get a refund?",
      dir: "ltr",
    },
    spans: [
      { name: "guard", detail: "safe · in scope", start: 0, duration: 360, depth: 0, kind: "llm" },
      { name: "workflow_dispatch", detail: "→ procedure: Returns", start: 360, duration: 480, depth: 0, kind: "llm" },
      { name: "workflow_loop", detail: "compiled control-flow graph", start: 840, duration: 2280, depth: 0, kind: "logic" },
      { name: "ask · order", detail: "filled from message", start: 880, duration: 420, depth: 1, kind: "llm" },
      { name: "action · get_order", detail: "1 match · 6 days old", start: 1320, duration: 560, depth: 1, kind: "tool" },
      { name: "judge · within 14 days?", detail: "yes", start: 1900, duration: 380, depth: 1, kind: "llm" },
      { name: "ask · exchange or refund", detail: "waiting on customer", start: 2300, duration: 120, depth: 1, kind: "logic" },
      { name: "say", detail: "English", start: 2440, duration: 640, depth: 1, kind: "llm" },
    ],
  },
];

// ── Career, as spans on a real time axis ─────────────────────────
export type Role = {
  org: string;
  title: string;
  start: string; // YYYY-MM
  end: string | null; // null = present
  place: string;
  kind: "work" | "study";
  summary: string;
  points: string[];
  tags: string[];
};

export const career: Role[] = [
  {
    org: "Princess Sumaya University for Technology",
    title: "BSc, Data Science & Artificial Intelligence",
    start: "2019-10",
    end: "2023-07",
    place: "Amman",
    kind: "study",
    summary: "Graduated with an 82% GPA.",
    points: [
      "Studied machine learning, statistics, data engineering and software design.",
      "Earned Microsoft Azure AI Fundamentals (AI-900) and Google Cloud Platform's Professional Data Analysis certificate (2022).",
    ],
    tags: ["Python", "ML", "Statistics"],
  },
  {
    org: "Arab Bank",
    title: "Predictive Data Analyst, intern",
    start: "2022-06",
    end: "2022-09",
    place: "Amman",
    kind: "work",
    summary: "Forecast sales so three business units could plan inventory.",
    points: [
      "Deployed time-series forecasting models for future sales trends.",
      "Presented the findings to executive leadership, which led to data-driven inventory planning across 3 business units.",
    ],
    tags: ["Time series", "Python", "Forecasting"],
  },
  {
    org: "PwC",
    title: "AI Engineer",
    start: "2023-12",
    end: "2024-07",
    place: "Amman · for NEOM",
    kind: "work",
    summary: "Built NEOM's semantic document search.",
    points: [
      "Designed and built a semantic search engine on OpenAI embeddings and ChromaDB. Retrieval accuracy improved by 80% and average search time dropped by 65%.",
      "Worked with client and AI teams so results matched business intent for 300,000+ users.",
    ],
    tags: ["OpenAI embeddings", "ChromaDB", "RAG", "Azure"],
  },
  {
    org: "ProgressSoft",
    title: "Java Software Engineer",
    start: "2024-09",
    end: "2024-11",
    place: "Amman",
    kind: "work",
    summary: "Hardened a financial platform used by 14+ banks.",
    points: [
      "Refactored the backend with SOLID principles in Spring Boot, which made the platform easier to maintain and new banks faster to onboard.",
    ],
    tags: ["Java", "Spring Boot", "Fintech"],
  },
  {
    org: "Amazon",
    title: "Software Development Engineer",
    start: "2024-11",
    end: "2025-12",
    place: "Amman · for Turkey, UAE, KSA",
    kind: "work",
    summary: "Fulfillment and delivery systems for MENA marketplaces.",
    points: [
      "Led a cross-functional compliance initiative in Turkey to print product serial numbers on invoices, across legal, operations and engineering. It covered 15M+ items and made fulfillment centers more accurate.",
      "Built automated 2-hour delivery workflows for the UAE and Saudi Arabia: auto-cancel, refunds for failed deliveries, and shipping-fee refunds for late orders.",
      "Shipped backend services on AWS Lambda and EC2 for large-scale e-commerce operations.",
    ],
    tags: ["Java", "AWS Lambda", "EC2", "Distributed systems"],
  },
  {
    org: "BusinessChat",
    title: "Senior Software Engineer",
    start: "2026-01",
    end: null,
    place: "Amman",
    kind: "work",
    summary: "AI agents for businesses on WhatsApp, from graph to infrastructure.",
    points: [
      "Designed and built the LangGraph agent that took the platform into healthcare. It answers questions about each business's doctors, specialists, services and branches, then books the appointment end to end.",
      "Cut e-commerce agent response time from 50–80s to 10–40s.",
      "Rebuilt document and FAQ ingestion (loading, chunking, embedding), improving retrieval accuracy by 20%.",
      "Built Procedures, which lets businesses write a workflow in plain sentences and compiles it into a graph the agent runs.",
    ],
    tags: ["Python", "LangGraph", "LangSmith", "Kotlin", "GCP"],
  },
];

// ── Selected work ────────────────────────────────────────────────
export type Work = {
  id: string;
  title: string;
  where: string;
  problem: string;
  built: string;
  result: string;
  stack: string[];
  visual: "graph" | "latency" | "compile" | "retrieval" | "scale";
};

export const work: Work[] = [
  {
    id: "healthcare-agent",
    title: "A booking agent for clinics",
    where: "BusinessChat, 2026",
    problem:
      "Patients ask in Arabic dialects, mix doctor names with specialties, and change their mind halfway through. Every clinic's catalog is shaped differently.",
    built:
      "A LangGraph agent driven by each business's schema. Messages pass a guard and a capability router, then an adaptive loop extracts mentions, resolves them against the catalog, checks live availability and confirms before it writes anything.",
    result: "It runs end to end in production, from the first question to a confirmed appointment.",
    stack: ["LangGraph", "LangSmith", "FastAPI", "Redis", "Milvus"],
    visual: "graph",
  },
  {
    id: "latency",
    title: "Making an e-commerce agent 2–5× faster",
    where: "BusinessChat, 2026",
    problem: "Shoppers waited close to a minute for an answer, long enough to leave the chat.",
    built:
      "Profiled each graph step in LangSmith, ran independent retrieval in parallel, removed redundant LLM round-trips and added fallback models with hard request timeouts.",
    result: "Responses dropped from 50–80s to 10–40s, depending on the query.",
    stack: ["LangSmith", "asyncio", "Gemini", "Claude"],
    visual: "latency",
  },
  {
    id: "procedures",
    title: "Procedures: workflows written in sentences",
    where: "BusinessChat, 2026",
    problem:
      "Businesses wanted their bot to follow their own processes, like returns, escalations and data collection, without filing a request with engineering.",
    built:
      "An editor where admins write steps with @variables and /action chips. Publishing compiles the text into a control-flow graph. At run time, the LLM is limited to four narrow jobs: dispatch, judge, intake and say. A nightly regression suite grades real traces.",
    result: "Admins build a workflow by writing it out, and the agent runs it the same way every time.",
    stack: ["Python", "LangGraph", "Next.js", "Kotlin", "PostgreSQL"],
    visual: "compile",
  },
  {
    id: "neom-search",
    title: "Semantic search for NEOM",
    where: "PwC, 2024",
    problem: "300,000+ people needed answers buried in a large, growing document library.",
    built:
      "An embedding pipeline and semantic search engine on OpenAI embeddings and ChromaDB that ranks results by context, not just keywords.",
    result: "Retrieval accuracy improved by 80% and search time dropped by 65%.",
    stack: ["OpenAI", "ChromaDB", "Python", "Azure"],
    visual: "retrieval",
  },
  {
    id: "amazon",
    title: "Invoices and 2-hour delivery at Amazon",
    where: "Amazon, 2025",
    problem:
      "Turkish regulations required serial numbers on invoices, and the 2-hour delivery promise in the Gulf needed automatic handling when it was missed.",
    built:
      "Led the serial-number initiative across legal, operations and engineering. Built the auto-cancel and refund workflows for 2-hour delivery in the UAE and Saudi Arabia.",
    result: "It covered 15M+ items, with better SLA compliance and customer satisfaction scores.",
    stack: ["Java", "AWS Lambda", "EC2"],
    visual: "scale",
  },
];

export const alsoShipped = [
  "Moved the agent runtime to strict mypy, which exposed and fixed 15 latent bugs",
  "Root-caused a production memory leak to per-turn gRPC channels",
  "Cut LangSmith tracing cost with sampling and payload trimming",
  "Generic entity and relation store, so any vertical can sync its catalog",
  "Schema translator on Cloud Run Jobs, fed by Pub/Sub events",
  "Detection of knowledge-base conflicts, with a review screen",
  "IDF-weighted fuzzy name matching for catalog search",
  "Nightly regression tiers that grade agent turns from their traces",
];

// ── Stack, grouped by the layer it runs in ───────────────────────
export const layers = [
  { name: "Channels", items: ["WhatsApp", "Web chat", "REST API"] },
  { name: "Agents", items: ["LangGraph", "LangChain", "LangSmith", "RAG", "Structured output"] },
  { name: "Services", items: ["Python · FastAPI", "Kotlin · Ktor", "Java · Spring Boot"] },
  { name: "Data", items: ["PostgreSQL", "Redis", "MongoDB", "Milvus", "ChromaDB", "BigQuery"] },
  { name: "Cloud", items: ["GCP Cloud Run", "Pub/Sub", "AWS Lambda", "EC2", "Azure", "Docker"] },
  { name: "Interfaces", items: ["React", "Next.js", "TypeScript", "Tailwind"] },
];

export const languages = [
  { name: "Arabic", level: "Native" },
  { name: "English", level: "Fluent" },
];
