import type { ApartmentCriteria, ApartmentListing } from "../types.js";

// Une source d'annonces branchable sur l'agent. Chaque implémentation
// reçoit un critère et renvoie les annonces qu'elle a trouvées pour ce
// critère (avant filtrage fin par matcher.ts).
export interface ListingSource {
  name: string;
  // true si cette source peut traiter ce critère (ex: un feedUrl est défini)
  supports(criteria: ApartmentCriteria): boolean;
  fetchListings(criteria: ApartmentCriteria): Promise<ApartmentListing[]>;
}
