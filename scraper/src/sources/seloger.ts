import { createHtmlSource } from "./html.js";
import { fetchRenderedHtml } from "./browser.js";
import type { ApartmentCriteria } from "../types.js";

/**
 * ⚠️ SÉLECTEURS NON VÉRIFIÉS EN DIRECT — encore plus fragile que
 * leboncoin.ts.
 *
 * SeLoger utilise historiquement des classes CSS générées automatiquement
 * (styled-components, type "sc-a1b2c3") qui changent à chaque déploiement
 * du site, contrairement à des attributs stables comme `data-testid`.
 * Ce code a été écrit sans accès réseau à seloger.com (bloqué dans
 * l'environnement où il a été développé): considérez les sélecteurs
 * ci-dessous comme un point de départ à corriger après inspection réelle
 * de la page (voir `scraper/debug/seloger.png` et `.html`, générés
 * automatiquement à chaque exécution).
 */

function buildSearchUrl(criteria: ApartmentCriteria): string {
  const params = new URLSearchParams();
  params.set("projects", "1"); // 1 = location — à vérifier
  params.set("types", criteria.propertyType === "maison" ? "2" : "1");
  params.set("places", JSON.stringify([{ ci: criteria.city }]));
  params.set("price", `${criteria.minPrice ?? "NaN"}/${criteria.maxPrice}`);
  if (criteria.minRooms) params.set("rooms", `${criteria.minRooms}-NaN`);
  return `https://www.seloger.com/list.htm?${params.toString()}`;
}

export const selogerSource = createHtmlSource({
  name: "seloger",
  buildSearchUrl,
  // Sélecteurs génériques (attribut data-testid, plus stable que les
  // classes générées) — à confirmer/adapter après inspection réelle.
  itemSelector: 'article[data-testid*="serp-core-classified-card"]',
  titleSelector: '[data-testid*="Title"]',
  priceSelector: '[data-testid*="Price"]',
  linkSelector: "a",
  fetchHtml: (url) =>
    fetchRenderedHtml(url, {
      waitForSelector: "article",
      debugName: "seloger",
    }),
});
