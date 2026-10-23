import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";
import { articles } from "@/content/writing";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: profile.siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${profile.siteUrl}${profile.cv}`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${profile.siteUrl}/writing`, changeFrequency: "weekly", priority: 0.7 },
    ...articles.map((a) => ({
      url: `${profile.siteUrl}/writing/${a.slug}`,
      lastModified: a.published,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
