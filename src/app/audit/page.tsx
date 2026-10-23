import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Agent audit",
  description:
    "A fixed-price, one-week review of a LangGraph or LangChain agent in production: answer quality, evals, cost, memory and code health, with evals left running.",
  alternates: { canonical: "/audit" },
};

const bookHref = "https://calendar.app.google/pHvy2PMSSRSjeSoy8";
const whatsappHref = `https://wa.me/962797909969?text=${encodeURIComponent("Hi Tariq, I'd like to talk about an agent audit.")}`;

const areas: { title: string; body: string; proof?: { label: string; slug: string } }[] = [
  {
    title: "Answer quality",
    body: "Wrong or ungrounded answers, wrong tool calls, and retrieval that pulls the wrong source, found in your real traces rather than demo prompts.",
    proof: { label: "When the knowledge base disagrees with itself", slug: "detecting-knowledge-base-conflicts" },
  },
  {
    title: "Evals and tests",
    body: "What your evals actually cover, what they miss, and which past failures nothing would catch if they came back.",
  },
  {
    title: "Cost",
    body: "Where model and tracing spend goes: duplicated state in traces, test traffic in production projects, oversized prompts, retries that quietly double calls.",
    proof: { label: "Cutting LangSmith costs without going blind", slug: "cutting-langsmith-tracing-costs" },
  },
  {
    title: "Memory and reliability",
    body: "Memory that grows per conversation, clients built per request, missing timeouts, and failure paths that leave a user waiting.",
    proof: { label: "The leak the garbage collector couldn't see", slug: "grpc-contextvars-memory-leak" },
  },
  {
    title: "Code health",
    body: "Types, tests and boundaries around the graph, so the next change doesn't silently break a node nobody is watching.",
    proof: { label: "1,901 type errors to zero on a live AI codebase", slug: "strict-mypy-on-a-live-ai-codebase" },
  },
];

const deliverables = [
  "A written report: each finding with its root cause, the evidence from your traces, and a fix, ranked by impact.",
  "Three to five evals built from the top findings, running in your CI after I leave.",
  "Fixes for the top two findings as pull requests.",
  "A one-hour walkthrough with your team, recorded.",
];

const steps = [
  { title: "A 30-minute call", body: "Free. We check that your agent is in production and that an audit is the right tool." },
  {
    title: "Read-only access",
    body: "Your traces (LangSmith, Langfuse or similar) and the repository. I sign your NDA. No write access to production and no customer database.",
  },
  { title: "Five working days", body: "I review the traces and code, reproduce the worst failures, and write the evals." },
  { title: "Handover", body: "Report, evals and pull requests, then the walkthrough." },
];

export default function AuditPage() {
  return (
    <>
      <Nav />
      <main id="main" className="pt-[calc(7rem+env(safe-area-inset-top))] pb-24">
        <div className="mx-auto max-w-[1240px] gutter">
          <h1 className="wide text-[clamp(2.75rem,8vw,6rem)] leading-[0.92] font-extrabold tracking-[-0.045em]">
            Agent audit
          </h1>
          <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-muted sm:text-xl">
            A one-week, fixed-price review of a LangGraph or LangChain agent that already answers real users. I read your
            production traces, find what&apos;s wrong and why, and leave you evals that keep catching it.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={bookHref}
              target="_blank"
              rel="noreferrer"
              className="press flex h-12 items-center rounded-full bg-text px-6 font-medium text-ink transition-opacity hover:opacity-90"
            >
              Book a 30-minute call
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="press flex h-12 items-center rounded-full border border-rule px-6 font-medium transition-colors hover:border-muted"
            >
              Message on WhatsApp
            </a>
          </div>

          <section aria-labelledby="areas" className="mt-24">
            <h2 id="areas" className="wide text-[clamp(1.8rem,4vw,2.75rem)] leading-tight font-bold tracking-[-0.035em]">
              What I look at
            </h2>
            <p className="mt-4 max-w-[60ch] leading-relaxed text-muted">
              I&apos;ve fixed each of these in a production agent; the links go to the write-ups.
            </p>
            <ul className="mt-10 border-t border-rule">
              {areas.map((a) => (
                <li key={a.title} className="grid gap-x-6 gap-y-2 border-b border-rule py-7 md:grid-cols-[300px_minmax(0,1fr)]">
                  <h3 className="wide text-xl font-bold tracking-[-0.02em]">{a.title}</h3>
                  <div>
                    <p className="max-w-[62ch] leading-relaxed text-muted">{a.body}</p>
                    {a.proof && (
                      <Link
                        href={`/writing/${a.proof.slug}`}
                        className="mt-3 inline-block text-sm font-medium text-signal underline decoration-signal/30 underline-offset-4 hover:decoration-signal"
                      >
                        {a.proof.label}
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="deliverables" className="mt-24 grid gap-10 lg:grid-cols-2">
            <div>
              <h2
                id="deliverables"
                className="wide text-[clamp(1.8rem,4vw,2.75rem)] leading-tight font-bold tracking-[-0.035em]"
              >
                What you get
              </h2>
              <ul className="mt-8 space-y-4">
                {deliverables.map((d) => (
                  <li key={d} className="flex gap-3 leading-relaxed">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-ok" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-rule bg-ink-2 p-8">
              <h2 className="text-sm text-faint">Price</h2>
              <p className="wide mt-2 text-[clamp(2.5rem,6vw,3.75rem)] leading-none font-extrabold tracking-[-0.04em]">
                $2,500
              </p>
              <p className="mt-2 text-muted">Fixed, for one agent. Half up front, half at handover.</p>
              <p className="mt-6 border-t border-rule pt-6 leading-relaxed">
                <span className="font-medium text-ok">First three teams: $1,500.</span>{" "}
                <span className="text-muted">In return, a short testimonial if you found it useful.</span>
              </p>
            </div>
          </section>

          <section aria-labelledby="steps" className="mt-24">
            <h2 id="steps" className="wide text-[clamp(1.8rem,4vw,2.75rem)] leading-tight font-bold tracking-[-0.035em]">
              How it works
            </h2>
            <ol className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s.title} className="border-t border-rule pt-5">
                  <p className="text-sm text-faint">Step {i + 1}</p>
                  <h3 className="mt-1 text-lg font-medium">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="who" className="mt-24 grid gap-10 lg:grid-cols-2">
            <div>
              <h2 id="who" className="wide text-[clamp(1.8rem,4vw,2.75rem)] leading-tight font-bold tracking-[-0.035em]">
                Who it&apos;s for
              </h2>
              <p className="mt-6 max-w-[56ch] leading-relaxed text-muted">
                Teams with an agent in front of customers, where someone is asking: are the answers right, why is the
                bill growing, why does memory keep climbing? If your agent isn&apos;t live yet, a design review fits
                better. Ask me about that instead.
              </p>
            </div>
            <div>
              <h2 className="wide text-[clamp(1.8rem,4vw,2.75rem)] leading-tight font-bold tracking-[-0.035em]">
                Who I am
              </h2>
              <p className="mt-6 max-w-[56ch] leading-relaxed text-muted">
                {profile.name}, a senior software engineer in {profile.location}. I build and run production AI agents
                at BusinessChat, and before that I was at Amazon. I wrote{" "}
                <a
                  href="https://github.com/tariqamarneh/python-leak-hunter"
                  target="_blank"
                  rel="noreferrer"
                  className="text-text underline decoration-rule underline-offset-4 hover:decoration-signal"
                >
                  python-leak-hunter
                </a>
                , an open-source tool for finding memory leaks in Python services, and I contribute fixes to Langfuse.
              </p>
            </div>
          </section>

          <section className="mt-24 border-t border-rule pt-12">
            <h2 className="wide text-[clamp(1.8rem,4vw,2.75rem)] leading-tight font-bold tracking-[-0.035em]">
              Start with a call
            </h2>
            <p className="mt-4 max-w-[56ch] leading-relaxed text-muted">
              Pick a time that suits you, and tell me what the agent does and what&apos;s worrying you.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={bookHref}
                target="_blank"
                rel="noreferrer"
                className="press flex h-12 items-center rounded-full bg-text px-6 font-medium text-ink transition-opacity hover:opacity-90"
              >
                Book a 30-minute call
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="press flex h-12 items-center rounded-full border border-rule px-6 font-medium transition-colors hover:border-muted"
              >
                Message on WhatsApp
              </a>
            </div>
            <p className="mt-6 text-muted">
              Or email me at <span className="text-text select-all">{profile.email}</span>. I reply within a day.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
