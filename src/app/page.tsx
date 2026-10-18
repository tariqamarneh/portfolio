import { Career } from "@/components/Career";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Stack } from "@/components/Stack";
import { Work } from "@/components/Work";
import { Writing } from "@/components/Writing";
import { articles } from "@/content/writing";

export default function Home() {
  return (
    <>
      <Nav home />
      <main>
        <Hero />
        <Work liveArticles={articles.map((a) => a.slug)} />
        <Career />
        <Stack />
        <Writing />
        <Contact />
      </main>
    </>
  );
}
