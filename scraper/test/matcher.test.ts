import { matchesCriteria } from "../src/matcher.js";
import type { ApartmentCriteria, ApartmentListing } from "../src/types.js";

const criteria: ApartmentCriteria = {
  id: "c1",
  userId: "u1",
  name: "Test Paris",
  city: "Paris",
  maxPrice: 1200,
  minRooms: 2,
  minSurface: 30,
  propertyType: "appartement",
  active: true,
};

const listings: ApartmentListing[] = [
  { id: "l1", source: "test", title: "Bel appart", price: 1100, city: "Paris 15e", rooms: 2, surface: 35, url: "https://x/1" },
  { id: "l2", source: "test", title: "Trop cher", price: 1800, city: "Paris", rooms: 3, surface: 40, url: "https://x/2" },
  { id: "l3", source: "test", title: "Mauvaise ville", price: 900, city: "Lyon", rooms: 2, surface: 32, url: "https://x/3" },
  { id: "l4", source: "test", title: "Trop petit", price: 800, city: "Paris", rooms: 1, surface: 18, url: "https://x/4" },
  { id: "l5", source: "test", title: "Accent/casse ville", price: 950, city: "paris", rooms: 2, surface: 30, url: "https://x/5" },
];

let pass = 0;
const expected: Record<string, boolean> = { l1: true, l2: false, l3: false, l4: false, l5: true };

for (const l of listings) {
  const result = matchesCriteria(l, criteria);
  const ok = result === expected[l.id];
  pass += ok ? 1 : 0;
  console.log(`${l.id} -> ${result ? "MATCH" : "no match"} (attendu: ${expected[l.id] ? "MATCH" : "no match"}) ${ok ? "OK" : "FAIL"}`);
}

console.log(`\n${pass}/${listings.length} tests OK`);
if (pass !== listings.length) process.exit(1);
