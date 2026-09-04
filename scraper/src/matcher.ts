import type { ApartmentCriteria, ApartmentListing } from "./types.js";

function normalizeCity(city: string): string {
  return city
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

// Identique en logique à src/utils/apartmentMatcher.ts côté app (voir ce
// fichier pour le commentaire sur le partage de code entre les deux runtimes).
export function matchesCriteria(
  listing: ApartmentListing,
  criteria: ApartmentCriteria
): boolean {
  if (
    criteria.city &&
    listing.city &&
    !normalizeCity(listing.city).includes(normalizeCity(criteria.city))
  ) {
    return false;
  }

  if (listing.price > criteria.maxPrice) return false;
  if (criteria.minPrice != null && listing.price < criteria.minPrice) {
    return false;
  }

  if (criteria.minRooms != null && (listing.rooms ?? 0) < criteria.minRooms) {
    return false;
  }

  if (
    criteria.minSurface != null &&
    (listing.surface ?? 0) < criteria.minSurface
  ) {
    return false;
  }

  return true;
}
