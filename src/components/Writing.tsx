import Link from "next/link";
import { articles, formatDate, readingMinutes } from "@/content/writing";

export function ArticleList({ limit }: { limit?: number }) {
  const shown = limit ? articles.slice(0, limit) : articles;
  return (
    <ol className="border-t border-rule">
      {shown.map((article) => (
        <li key={article.slug} className="border-b border-rule">
          <Link
            href={`/writing/${article.slug}`}
            className="group grid gap-x-6 gap-y-2 py-7 md:grid-cols-[300px_minmax(0,1fr)]"
          >
            <p className="text-sm text-faint md:pt-1.5">
              <time dateTime={article.published}>{formatDate(article.published)}</time>
              <span aria-hidden> · </span>
              {readingMinutes(article)} min read
              {article.draft && <span className="ml-2 rounded-full bg-tool px-2 py-0.5 text-xs font-medium text-ink">Draft</span>}
            </p>
            <div>
              <h3 className="wide text-[clamp(1.3rem,2.4vw,1.85rem)] leading-tight font-bold tracking-[-0.03em] transition-colors group-hover:text-signal">
                {article.title}
              </h3>
              <p className="mt-2 max-w-[62ch] leading-relaxed text-muted">{article.description}</p>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}

const HOME_LIMIT = 4;

export function Writing() {
  return (
    <section id="writing" className="border-t border-rule py-24">
      <div className="mx-auto max-w-[1240px] gutter">
        <div className="grid gap-6 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] md:gap-x-6">
          <h2 className="wide text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
            Writing
          </h2>
          <p className="max-w-[52ch] self-end text-lg leading-relaxed text-muted">
            Notes from building production agents: what was slow, what broke, and what I changed.
          </p>
        </div>
        <div className="mt-14">
          <ArticleList limit={HOME_LIMIT} />
        </div>
        {articles.length > HOME_LIMIT && (
          <Link
            href="/writing"
            className="press mt-8 inline-flex h-11 items-center rounded-full border border-rule px-5 text-sm font-medium transition-colors hover:border-text"
          >
            All {articles.length} articles →
          </Link>
        )}
      </div>
    </section>
  );
}
