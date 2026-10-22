import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArticleBody } from "@/components/ArticleBody";
import { Nav } from "@/components/Nav";
import { profile } from "@/content/profile";
import { articles, formatDate, getArticle, readingMinutes } from "@/content/writing";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  if (article.draft) return { title: article.title, robots: { index: false } };
  const url = `/writing/${article.slug}`;
  const description = article.seoDescription ?? article.description;
  return {
    title: article.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description,
      publishedTime: article.published,
      authors: [profile.siteUrl],
      tags: article.tags,
    },
    twitter: { card: "summary_large_image", title: article.title, description },
  };
}

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  // Params are read inside Suspense (Cache Components); every slug is prerendered, so this ships as static HTML.
  return (
    <>
      <Nav />
      <Suspense>
        <ArticleView params={params} />
      </Suspense>
    </>
  );
}

async function ArticleView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const index = articles.indexOf(article);
  const next = articles[(index + 1) % articles.length];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.published,
    url: `${profile.siteUrl}/writing/${article.slug}`,
    mainEntityOfPage: `${profile.siteUrl}/writing/${article.slug}`,
    keywords: article.tags.join(", "),
    author: { "@type": "Person", "@id": `${profile.siteUrl}/#person`, name: profile.name, url: profile.siteUrl },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <main id="main" className="gutter pt-[calc(7rem+env(safe-area-inset-top))] pb-24">
        <article className="mx-auto max-w-[44rem]">
          <Link href="/writing" className="text-sm text-muted transition-colors hover:text-text">
            ← Writing
          </Link>
          <header className="mt-6 border-b border-rule pb-10">
            <h1 className="wide text-[clamp(2.1rem,5.4vw,3.6rem)] leading-[1.02] font-extrabold tracking-[-0.04em]">
              {article.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted sm:text-xl">{article.description}</p>
            <p className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-sm text-faint">
              <span>{profile.name}</span>
              <span aria-hidden>·</span>
              <time dateTime={article.published}>{formatDate(article.published)}</time>
              <span aria-hidden>·</span>
              <span>{readingMinutes(article)} min read</span>
              {article.draft && <span className="rounded-full bg-tool px-2 text-xs leading-5 font-medium text-ink">Draft</span>}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-rule px-3 py-1 text-xs text-muted">
                  {tag}
                </li>
              ))}
            </ul>
          </header>

          <div className="pt-10">
            <ArticleBody blocks={article.body} />
          </div>

          <footer className="mt-16 space-y-10 border-t border-rule pt-10">
            {next && next !== article && (
              <Link href={`/writing/${next.slug}`} className="group block">
                <span className="text-sm text-faint">Next</span>
                <span className="wide mt-1 block text-[clamp(1.3rem,2.6vw,1.75rem)] leading-tight font-bold tracking-[-0.03em] transition-colors group-hover:text-signal">
                  {next.title} →
                </span>
              </Link>
            )}
            <div className="rounded-2xl border border-rule bg-ink-2 px-6 py-6">
              <p className="text-lg font-semibold">Building something similar?</p>
              <p className="mt-1 text-muted">I&apos;m happy to talk about agents, RAG and the backends behind them.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="press flex h-11 items-center rounded-full bg-text px-5 text-sm font-medium text-ink"
                >
                  Email me
                </a>
                <a
                  href={profile.linkedin}
                  className="press flex h-11 items-center rounded-full border border-rule px-5 text-sm font-medium"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </footer>
        </article>
      </main>
    </>
  );
}
