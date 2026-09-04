import type { ApartmentCriteria, ApartmentListing } from "../../types";

// Normalise une ville pour une comparaison insensible à la casse/accents
function normalizeCity(city: string): string {
  return city
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

// Vrai si l'annonce respecte tous les critères actifs de l'utilisateur.
// Fonction pure: réutilisée telle quelle (logique dupliquée en JS simple)
// par le scraper Node dans scraper/src/matcher.ts.
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
