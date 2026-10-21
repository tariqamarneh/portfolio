// Tells IndexNow search engines (Bing, Yandex, Seznam, Naver) about every URL
// in the live sitemap. Run after a production deploy: `node scripts/indexnow.mjs`.

const SITE = "https://www.tariqamarneh.com";
const KEY = "f219e11976a89c434bf3ef8951f90b5c"; // served from public/<KEY>.txt

const sitemap = await fetch(`${SITE}/sitemap.xml`).then((r) => {
  if (!r.ok) throw new Error(`sitemap.xml returned ${r.status}`);
  return r.text();
});
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) throw new Error("No URLs found in sitemap.xml");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList,
  }),
});

console.log(`IndexNow: ${res.status} for ${urlList.length} URLs`);
urlList.forEach((u) => console.log(`  ${u}`));
// 200 = accepted, 202 = accepted while the key is being verified.
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}
