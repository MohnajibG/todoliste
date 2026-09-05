import { getActiveCriteria, writeNotificationIfNew } from "./firestore.js";
import { matchesCriteria } from "./matcher.js";
import { rssSource } from "./sources/rss.js";
import { leboncoinSource } from "./sources/leboncoin.js";
import { selogerSource } from "./sources/seloger.js";
import type { ListingSource } from "./sources/types.js";

// Sources disponibles. Un critère peut être surveillé par plusieurs
// sources en même temps (ex: un feedUrl RSS + leboncoin).
const sources: ListingSource[] = [rssSource, leboncoinSource, selogerSource];

const REQUEST_DELAY_MS = Number(process.env.REQUEST_DELAY_MS ?? 1500);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const criteria = await getActiveCriteria();
  console.log(`[agent] ${criteria.length} critère(s) actif(s) à surveiller`);

  let newNotifications = 0;

  for (const c of criteria) {
    const matchingSources = sources.filter((s) => s.supports(c));

    if (matchingSources.length === 0) {
      console.log(`[agent] critère "${c.name}": aucune source configurée, ignoré`);
      continue;
    }

    for (const source of matchingSources) {
      try {
        const listings = await source.fetchListings(c);
        const matches = listings.filter((listing) => matchesCriteria(listing, c));

        console.log(
          `[agent] critère "${c.name}" (${source.name}): ${listings.length} annonce(s), ${matches.length} correspondance(s)`
        );

        for (const listing of matches) {
          const created = await writeNotificationIfNew(c.userId, c, listing);
          if (created) newNotifications += 1;
        }
      } catch (err) {
        console.error(`[agent] échec pour le critère "${c.name}" (source ${source.name}):`, err);
      }

      await sleep(REQUEST_DELAY_MS);
    }
  }

  console.log(`[agent] terminé: ${newNotifications} nouvelle(s) notification(s)`);
}

run().catch((err) => {
  console.error("[agent] erreur fatale:", err);
  process.exitCode = 1;
});
