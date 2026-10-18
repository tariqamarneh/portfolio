import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { ArticleList } from "@/components/Writing";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Writing",
  description: `Engineering notes by ${profile.name} on building production AI agents with LangGraph, RAG and LangSmith.`,
  alternates: { canonical: "/writing" },
};

export default function WritingPage() {
  return (
    <>
      <Nav />
      <main className="pt-[calc(7rem+env(safe-area-inset-top))] pb-24">
        <div className="mx-auto max-w-[1240px] gutter">
          <h1 className="wide text-[clamp(2.75rem,8vw,6rem)] leading-[0.92] font-extrabold tracking-[-0.045em]">
            Writing
          </h1>
          <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-muted">
            Notes from building production AI agents: what was slow, what broke, and what I changed.
          </p>
          <div className="mt-14">
            <ArticleList />
          </div>
        </div>
      </main>
    </>
  );
}
