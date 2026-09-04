import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import type { ApartmentCriteria, ApartmentListing } from "./types.js";

function loadServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY manquant. Voir scraper/.env.example."
    );
  }
  return JSON.parse(raw);
}

const app = initializeApp({ credential: cert(loadServiceAccount()) });
export const db = getFirestore(app);
// Les annonces ont des champs optionnels (rooms, surface, imageUrl...) qui
// peuvent être `undefined` selon ce que la source a réussi à extraire.
// Firestore rejette `undefined` par défaut: on l'ignore plutôt que de
// filtrer champ par champ à chaque écriture.
db.settings({ ignoreUndefinedProperties: true });

// Récupère les critères actifs de tous les utilisateurs
// (users/{uid}/apartmentCriteria/{id}).
export async function getActiveCriteria(): Promise<ApartmentCriteria[]> {
  const snapshot = await db
    .collectionGroup("apartmentCriteria")
    .where("active", "==", true)
    .get();

  return snapshot.docs.map((docSnap) => {
    const userId = docSnap.ref.parent.parent?.id;
    if (!userId) {
      throw new Error(`Critère ${docSnap.id} sans utilisateur parent`);
    }
    return {
      id: docSnap.id,
      userId,
      ...docSnap.data(),
    } as ApartmentCriteria;
  });
}

// Écrit une notification si elle n'existe pas déjà (dédoublonnage par
// id d'annonce, utilisé comme id de document).
export async function writeNotificationIfNew(
  userId: string,
  criteria: ApartmentCriteria,
  listing: ApartmentListing
): Promise<boolean> {
  const ref = db
    .collection("users")
    .doc(userId)
    .collection("apartmentNotifications")
    .doc(listing.id);

  const existing = await ref.get();
  if (existing.exists) return false;

  await ref.set({
    criteriaId: criteria.id,
    criteriaName: criteria.name,
    listing,
    read: false,
    createdAt: FieldValue.serverTimestamp(),
  });

  return true;
}
