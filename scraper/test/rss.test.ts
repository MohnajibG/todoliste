import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { rssSource } from "../src/sources/rss.js";
import { matchesCriteria } from "../src/matcher.js";
import type { ApartmentCriteria } from "../src/types.js";

const server = createServer(async (_req, res) => {
  const xml = await readFile(new URL("./fixtures/sample-feed.xml", import.meta.url));
  res.writeHead(200, { "Content-Type": "application/rss+xml" });
  res.end(xml);
});

await new Promise<void>((resolve) => server.listen(0, resolve));
const address = server.address();
if (!address || typeof address === "string") throw new Error("port introuvable");
const feedUrl = `http://127.0.0.1:${address.port}/feed.xml`;

const criteria: ApartmentCriteria = {
  id: "c1",
  userId: "u1",
  name: "Paris pas cher",
  city: "Paris",
  maxPrice: 1200,
  minRooms: 2,
  minSurface: 30,
  propertyType: "appartement",
  feedUrl,
  active: true,
};

const listings = await rssSource.fetchListings(criteria);
console.log(`${listings.length} annonce(s) récupérée(s) depuis le flux RSS de test:\n`);

for (const l of listings) {
  console.log(JSON.stringify(l, null, 2));
}

const matches = listings.filter((l) => matchesCriteria(l, criteria));
console.log(`\n--- ${matches.length} correspondance(s) pour le critère "${criteria.name}" ---`);
for (const m of matches) {
  console.log(`✔ ${m.title} — ${m.price}€ — ${m.city || "(ville non extraite)"} — ${m.url}`);
}

const matchedUrls = matches.map((m) => m.url);
const ok =
  matches.length === 2 &&
  matchedUrls.some((u) => u.endsWith("1001")) &&
  matchedUrls.some((u) => u.endsWith("1003"));

console.log(`\n${ok ? "OK" : "FAIL"}: attendu 2 correspondances (annonces 1001 et 1003)`);

server.close();
if (!ok) process.exit(1);
