import * as cheerio from "cheerio";
import { createHash } from "node:crypto";
import type { ApartmentCriteria, ApartmentListing } from "../types.js";
import type { ListingSource } from "./types.js";

/**
 * ⚠️ LIMITES IMPORTANTES — à lire avant de configurer cette source.
 *
 * Cet adaptateur fait une simple requête HTTP GET puis parse le HTML avec
 * cheerio. Il ne fonctionne QUE pour des sites qui renvoient le contenu
 * directement en HTML statique, sans protection anti-bot.
 *
 * Des portails comme leboncoin.fr ou seloger.com utilisent des protections
 * (ex: Datadome) qui bloquent ce type de requête et renvoient une page de
 * challenge/CAPTCHA au lieu des annonces — ce n'est pas un bug de ce code,
 * c'est le comportement attendu de ces sites. Ce projet n'implémente
 * volontairement aucune technique de contournement (navigateur headless
 * avec empreinte falsifiée, résolution de CAPTCHA, rotation d'IP/proxies):
 * ce serait fragile, contraire aux CGU de ces sites, et hors du périmètre
 * d'un outil de recherche personnelle.
 *
 * Pour surveiller un site protégé, deux options réalistes:
 *  1. Utiliser son flux RSS s'il en propose un pour les recherches
 *     sauvegardées (voir sources/rss.ts).
 *  2. Utiliser une API officielle si le site/l'éditeur en propose une.
 *
 * Cet adaptateur reste utile pour des sites plus simples (petites annonces
 * locales, sites d'agences sans protection, etc.). Configurez les
 * sélecteurs CSS via HTML_SOURCE_CONFIG (voir README.md du dossier
 * scraper/) en inspectant vous-même le site ciblé.
 */

export interface HtmlSourceConfig {
  // {city} et {maxPrice} sont substitués dans buildSearchUrl
  buildSearchUrl: (criteria: ApartmentCriteria) => string;
  itemSelector: string;
  titleSelector: string;
  priceSelector: string;
  linkSelector: string;
  citySelector?: string;
  roomsSelector?: string;
  surfaceSelector?: string;
}

export function createHtmlSource(config: HtmlSourceConfig): ListingSource {
  return {
    name: "html",

    supports(): boolean {
      // Cette source doit être branchée explicitement (pas de détection
      // automatique: chaque site a une configuration différente).
      return false;
    },

    async fetchListings(criteria: ApartmentCriteria): Promise<ApartmentListing[]> {
      const url = config.buildSearchUrl(criteria);

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

      const html = await response.text();
      const $ = cheerio.load(html);
      const listings: ApartmentListing[] = [];

      $(config.itemSelector).each((_, el) => {
        const node = $(el);
        const href = node.find(config.linkSelector).attr("href");
        if (!href) return;

        const priceText = node.find(config.priceSelector).text();
        const price = Number(priceText.replace(/[^\d]/g, ""));

        listings.push({
          id: createHash("sha1").update(href).digest("hex"),
          source: "html",
          title: node.find(config.titleSelector).text().trim(),
          price: Number.isFinite(price) ? price : Number.POSITIVE_INFINITY,
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
