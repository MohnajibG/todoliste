import { createHtmlSource } from "./html.js";
import { fetchRenderedHtml } from "./browser.js";
import type { ApartmentCriteria } from "../types.js";

/**
 * ⚠️ SÉLECTEURS NON VÉRIFIÉS EN DIRECT.
 *
 * Ce code a été écrit dans un environnement dont le réseau bloque l'accès
 * à leboncoin.fr — impossible d'y inspecter la page réelle ou de tester
 * cet adaptateur avant de vous le livrer. Les valeurs ci-dessous
 * (paramètres d'URL, sélecteurs CSS) sont un point de départ basé sur la
 * structure connue du site, mais leboncoin change régulièrement ses
 * attributs `data-test-id` et ses classes.
 *
 * Si `npm start` rapporte 0 annonce pour un critère qui utilise cette
 * source: ouvrez `scraper/debug/leboncoin.png` et `.html` (générés
 * automatiquement à chaque exécution), inspectez la vraie structure d'une
 * carte d'annonce dans votre navigateur, et ajustez les sélecteurs
 * ci-dessous en conséquence.
 */

function buildSearchUrl(criteria: ApartmentCriteria): string {
  const params = new URLSearchParams();
  params.set("category", "10"); // Locations immobilières — à vérifier
  params.set("locations", criteria.city);
  params.set("price", `${criteria.minPrice ?? 0}-${criteria.maxPrice}`);
  if (criteria.minRooms) params.set("rooms", `${criteria.minRooms}-max`);
  if (criteria.propertyType === "appartement") params.set("real_estate_type", "1");
  if (criteria.propertyType === "maison") params.set("real_estate_type", "2");
  return `https://www.leboncoin.fr/recherche?${params.toString()}`;
}

export const leboncoinSource = createHtmlSource({
  name: "leboncoin",
  buildSearchUrl,
  // Sélecteur de chaque carte d'annonce (l'élément <a> du lien lui-même).
  itemSelector: '[data-test-id="ad"]',
  titleSelector: '[data-test-id="adcard-title"], p[title]',
  priceSelector: '[data-test-id="price"]',
  // itemSelector désigne déjà le lien: pas de linkSelector séparé.
  fetchHtml: (url) =>
    fetchRenderedHtml(url, {
      waitForSelector: '[data-test-id="ad"]',
      debugName: "leboncoin",
    }),
});
