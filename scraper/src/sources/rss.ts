import Parser from "rss-parser";
import { createHash } from "node:crypto";
import type { ApartmentCriteria, ApartmentListing } from "../types.js";
import type { ListingSource } from "./types.js";

const parser = new Parser();

// Source générique: surveille n'importe quel flux RSS/Atom d'alertes
// immobilières (recherche sauvegardée exposée en RSS par un portail,
// flux généré par un service tiers, etc.). Le prix/nb de pièces/surface
// sont extraits par regex depuis le titre + le résumé, car le format
// RSS ne standardise pas ces champs.
export const rssSource: ListingSource = {
  name: "rss",

  supports(criteria: ApartmentCriteria): boolean {
    return Boolean(criteria.feedUrl);
  },

  async fetchListings(criteria: ApartmentCriteria): Promise<ApartmentListing[]> {
    if (!criteria.feedUrl) return [];

    const feed = await parser.parseURL(criteria.feedUrl);

    return feed.items
      .filter((item) => item.link)
      .map((item) => {
        const title = item.title ?? "";
        const text = `${title} ${item.contentSnippet ?? item.content ?? ""}`;

        return {
          id: hashId(item.link!),
          source: "rss",
          title: item.title ?? "Annonce sans titre",
          price: extractPrice(text) ?? Number.POSITIVE_INFINITY,
          // Ne PAS retomber sur criteria.city ici: on ne sait pas quelle est
          // la vraie ville de l'annonce, donc on laisse vide plutôt que
          // d'afficher/valider une ville non confirmée. matchesCriteria
          // laisse passer une ville vide (impossible à vérifier) plutôt que
          // de rejeter à tort une annonce dont on n'a pas su extraire la ville.
          // Extraction sur le titre seul (pas la description) pour éviter
          // d'avaler la phrase suivante dans le résumé.
          city: extractCity(title) ?? "",
          rooms: extractRooms(text),
          surface: extractSurface(text),
          url: item.link!,
          publishedAt: item.isoDate ?? item.pubDate,
        } satisfies ApartmentListing;
      });
  },
};

function hashId(value: string): string {
  return createHash("sha1").update(value).digest("hex");
}

function extractPrice(text: string): number | undefined {
  const match = text.match(/([\d][\d\s.,]{2,})\s?€/);
  if (!match) return undefined;
  const digits = match[1].replace(/[^\d]/g, "");
  return digits ? Number(digits) : undefined;
}

function extractRooms(text: string): number | undefined {
  const match = text.match(/(\d+)\s?(?:pièces?|p\.)/i);
  return match ? Number(match[1]) : undefined;
}

function extractSurface(text: string): number | undefined {
  // Pas de `\b` après "²": ce n'est pas un caractère "mot" donc `\b` ne
  // matche jamais entre "²" et l'espace qui suit (deux non-mots).
  const match = text.match(/(\d+(?:[.,]\d+)?)\s?m(?:²|2)(?!\w)/i);
  return match ? Number(match[1].replace(",", ".")) : undefined;
}

function extractCity(title: string): string | undefined {
  // Best-effort, sur le titre seul: cherche "à <Ville>". Un mot suivant est
  // inclus seulement s'il commence aussi par une majuscule/chiffre (ex:
  // "Paris 15e"), pour éviter d'avaler le reste de la phrase.
  const match = title.match(
    /(?:à|a)\s+([A-ZÀ-Ý][\wÀ-ÿ-]*(?:[\s-](?:[A-ZÀ-Ý][\wÀ-ÿ-]*|\d[\wÀ-ÿ-]*))*)/
  );
  return match ? match[1].trim() : undefined;
}
