export type PropertyType = "appartement" | "maison" | "tous";

// Miroir de types.ts (racine du repo) côté app.
// Dupliqué ici volontairement: ce package tourne dans un runtime Node
// séparé (firebase-admin, pas de bundling Vite) et ne partage pas de
// build step avec l'app front.
export interface ApartmentCriteria {
  id: string;
  userId: string;
  name: string;
  city: string;
  minPrice?: number;
  maxPrice: number;
  minRooms?: number;
  minSurface?: number;
  propertyType: PropertyType;
  feedUrl?: string;
  active: boolean;
}

export interface ApartmentListing {
  id: string;
  source: string;
  title: string;
  price: number;
  city: string;
  rooms?: number;
  surface?: number;
  url: string;
  imageUrl?: string;
  publishedAt?: string;
}
