import * as cheerio from "cheerio";
import { createHash } from "node:crypto";
import type { ApartmentCriteria, ApartmentListing } from "../types.js";
import type { ListingSource } from "./types.js";

/**
 * ⚠️ LIMITES IMPORTANTES — à lire avant de configurer une source basée
 * sur ce module.
 *
 * Par défaut (sans `fetchHtml` personnalisé), cet adaptateur fait une
 * simple requête HTTP GET puis parse le HTML avec cheerio. Il ne
 * fonctionne QUE pour des sites qui renvoient le contenu directement en
 * HTML statique, sans rendu JavaScript côté client ni protection anti-bot.
 *
 * Pour un site qui affiche ses résultats via React/Next.js (leboncoin,
 * SeLoger...), fournissez `fetchHtml` avec `fetchRenderedHtml` de
 * `./browser.js` (voir `leboncoin.ts`/`seloger.ts`) qui utilise un vrai
 * navigateur headless. Même avec ça, une protection anti-bot peut bloquer
 * la requête (CAPTCHA/challenge) — ce module ne tente aucun contournement
 * (empreinte falsifiée, résolution de CAPTCHA, rotation de proxies): ce
 * serait fragile et contraire aux CGU de ces sites.
 */

export interface HtmlSourceConfig {
  // Identifiant utilisé dans `criteria.sources` pour activer cette source
  // (ex: "leboncoin", "seloger").
  name: string;
  buildSearchUrl: (criteria: ApartmentCriteria) => string;
  itemSelector: string;
  titleSelector: string;
  priceSelector: string;
  // Optionnel: sélecteur du lien à l'intérieur de itemSelector. Si absent,
  // on suppose que itemSelector désigne directement l'élément <a>.
  linkSelector?: string;
  citySelector?: string;
  roomsSelector?: string;
  surfaceSelector?: string;
  // Par défaut: simple requête HTTP GET. Fournir `fetchRenderedHtml`
  // (browser.ts) pour les sites qui nécessitent l'exécution du JS.
  fetchHtml?: (url: string) => Promise<string>;
}

async function defaultFetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; apartment-agent/0.1; personal use)",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Échec du chargement de ${url}: HTTP ${response.status}`
    );
  }

  return response.text();
}

export function createHtmlSource(config: HtmlSourceConfig): ListingSource {
  return {
    name: config.name,

    supports(criteria: ApartmentCriteria): boolean {
      return criteria.sources?.includes(config.name) ?? false;
    },

    async fetchListings(criteria: ApartmentCriteria): Promise<ApartmentListing[]> {
      const url = config.buildSearchUrl(criteria);
      const html = await (config.fetchHtml ?? defaultFetchHtml)(url);
      const $ = cheerio.load(html);
      const listings: ApartmentListing[] = [];

      $(config.itemSelector).each((_, el) => {
        const node = $(el);
        const href = config.linkSelector
          ? node.find(config.linkSelector).attr("href")
          : node.attr("href");
        if (!href) return;

        const priceText = node.find(config.priceSelector).text();
        const price = Number(priceText.replace(/[^\d]/g, ""));

        listings.push({
          id: createHash("sha1").update(href).digest("hex"),
          source: config.name,
          title: node.find(config.titleSelector).text().trim(),
          price: Number.isFinite(price) && price > 0 ? price : Number.POSITIVE_INFINITY,
          city: config.citySelector
            ? node.find(config.citySelector).text().trim()
            : criteria.city,
          rooms: config.roomsSelector
            ? Number(node.find(config.roomsSelector).text().replace(/\D/g, "")) ||
              undefined
            : undefined,
          surface: config.surfaceSelector
            ? Number(
                node.find(config.surfaceSelector).text().replace(/[^\d.,]/g, "").replace(",", ".")
              ) || undefined
            : undefined,
          url: href.startsWith("http") ? href : new URL(href, url).toString(),
        });
      });

      return listings;
    },
  };
}
