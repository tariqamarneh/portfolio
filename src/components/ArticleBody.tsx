import { Fragment, type ReactNode } from "react";
import type { Block } from "@/content/writing";

const kindStyle = {
  llm: { dot: "bg-signal", label: "LLM" },
  tool: { dot: "bg-tool", label: "tool" },
  logic: { dot: "bg-logic", label: "code" },
} as const;

/** Renders `code` spans, **bold** and *italic* runs; everything else is plain text. */
function inline(text: string): ReactNode {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g).map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded-md bg-ink-3 px-1.5 py-0.5 font-mono text-[0.86em] text-text">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-text">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="text-text italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="text-[1.0625rem] leading-[1.75] text-muted sm:text-lg">{inline(block.text)}</p>;

    case "h2":
      return (
        <h2
          id={slugify(block.text)}
          className="wide scroll-mt-24 pt-6 text-[clamp(1.5rem,3vw,2rem)] leading-tight font-bold tracking-[-0.03em] text-text"
        >
          {block.text}
        </h2>
      );

    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List
          className={`space-y-2.5 pl-5 text-[1.0625rem] leading-[1.7] text-muted marker:text-faint sm:text-lg ${
            block.ordered ? "list-decimal" : "list-disc"
          }`}
        >
          {block.items.map((item) => (
            <li key={item} className="pl-1.5">
              {inline(item)}
            </li>
          ))}
        </List>
      );
    }

    case "code":
      return (
        <figure className="-mx-4 sm:mx-0">
          <div className="overflow-hidden border-y border-rule bg-ink-2 sm:rounded-xl sm:border">
            <div className="flex items-center justify-between border-b border-rule px-4 py-2 font-mono text-xs text-faint">
              <span>{block.lang}</span>
            </div>
            <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed text-text">
              <code>{block.code}</code>
            </pre>
          </div>
          {block.caption && (
            <figcaption className="mt-2 px-4 text-sm text-faint sm:px-0">{inline(block.caption)}</figcaption>
          )}
        </figure>
      );

    case "callout":
      return (
        <aside className="rounded-xl border border-rule bg-signal-soft px-5 py-4 text-[1.0625rem] leading-[1.7] text-text">
          {inline(block.text)}
        </aside>
      );

    case "quote":
      return (
        <blockquote className="wide border-l-2 border-signal pl-5 text-[clamp(1.25rem,2.4vw,1.6rem)] leading-snug font-medium tracking-[-0.02em] text-text">
          {inline(block.text)}
        </blockquote>
      );

    case "stats":
      return (
        <dl className="grid gap-px overflow-hidden rounded-xl border border-rule bg-rule sm:grid-cols-3">
          {block.items.map((item) => (
            <div key={item.label} className="bg-ink-2 px-5 py-5">
              <dt className="text-sm text-faint">{item.label}</dt>
              <dd className="wide mt-1 text-[clamp(1.6rem,3.2vw,2.2rem)] leading-none font-bold tracking-[-0.03em] text-text">
                {item.value}
              </dd>
              {item.note && <dd className="mt-2 text-sm leading-snug text-muted">{inline(item.note)}</dd>}
            </div>
          ))}
        </dl>
      );

    case "steps":
      return (
        <figure>
          <ol className="rounded-xl border border-rule bg-ink-2 px-4 py-3 font-mono text-[13px]">
            {block.items.map((step, i) => (
              <li
                key={`${step.name}-${i}`}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-x-3 border-b border-rule/60 py-2.5 last:border-b-0"
              >
                <span className={`size-2 translate-y-[-1px] rounded-full ${kindStyle[step.kind].dot}`} aria-hidden />
                <span className="min-w-0">
                  <span className="text-text">{step.name}</span>
                  {step.note && <span className="mt-0.5 block font-sans text-sm leading-snug text-muted">{inline(step.note)}</span>}
                </span>
                <span className="text-xs text-faint">{kindStyle[step.kind].label}</span>
              </li>
            ))}
          </ol>
          {block.caption && <figcaption className="mt-2 text-sm text-faint">{inline(block.caption)}</figcaption>}
        </figure>
      );
  }
}

export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}
