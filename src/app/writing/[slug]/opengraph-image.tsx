import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";
import { articles, getArticle } from "@/content/writing";

// Share card for each article, prerendered at build time.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `Article by ${profile.name}`;

export function generateStaticParams() {
  return articles.filter((a) => !a.draft).map((a) => ({ slug: a.slug }));
}

const asset = (name: string) => readFile(join(process.cwd(), "assets/og", name));

// Cut at a word boundary so the card never shows a half word.
function clip(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(" ", max))}…`;
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  // Rendered inside 'use cache' so each card is prerendered with its page (Cache Components).
  const png = await renderCard(params.then((p) => p.slug));
  return new Response(png, { headers: { "Content-Type": contentType } });
}

async function renderCard(slugPromise: Promise<string>) {
  "use cache";
  const slug = await slugPromise;
  const article = getArticle(slug);
  if (!article || article.draft) notFound();

  const [display, body, mono, portrait] = await Promise.all([
    asset("Archivo-Expanded-ExtraBold.ttf"),
    asset("Archivo-Medium.ttf"),
    asset("JetBrainsMono-Regular.ttf"),
    asset("portrait-192.png"),
  ]);

  const card = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#0d1526",
          backgroundImage:
            "linear-gradient(rgba(138,180,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(138,180,255,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          color: "#e8ecf3",
          fontFamily: "Archivo",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ width: 56, height: 8, borderRadius: 4, background: "#8ab4ff" }} />
            <div style={{ width: 56, height: 8, borderRadius: 4, marginLeft: 18, background: "#ffd166" }} />
            <div style={{ width: 56, height: 8, borderRadius: 4, marginLeft: 36, background: "#6ee7b7" }} />
          </div>
          <div style={{ fontSize: 26, color: "#9ba7bd" }}>Engineering notes</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontFamily: "Archivo Expanded",
              fontSize: article.title.length > 48 ? 54 : 64,
              lineHeight: 1.06,
              letterSpacing: -2,
            }}
          >
            {article.title}
          </div>
          <div style={{ fontSize: 26, lineHeight: 1.4, color: "#9ba7bd", maxWidth: 1040 }}>
            {clip(article.description, 240)}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <img
              src={`data:image/png;base64,${portrait.toString("base64")}`}
              width={64}
              height={64}
              alt=""
              style={{ borderRadius: 32, background: "#18253f", objectFit: "cover" }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 26 }}>{profile.name}</div>
              <div style={{ fontSize: 20, color: "#9ba7bd" }}>{profile.role}</div>
            </div>
          </div>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 24, color: "#8ab4ff" }}>tariqamarneh.com</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo Expanded", data: display, weight: 800, style: "normal" },
        { name: "Archivo", data: body, weight: 500, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
  return new Uint8Array(await card.arrayBuffer());
}
