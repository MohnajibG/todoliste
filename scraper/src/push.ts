import { getMessaging } from "firebase-admin/messaging";
import { app, db } from "./firestore.js";
import type { ApartmentListing } from "./types.js";

// Envoie une notification push (Web Push via FCM) à tous les appareils
// que l'utilisateur a enregistrés (users/{uid}/fcmTokens, écrit par
// l'app front quand il active les notifications sur la page Agent).
// Silencieux si l'utilisateur n'a activé les notifications sur aucun
// appareil : la notification in-app (Firestore) reste créée dans tous
// les cas par `writeNotificationIfNew`.
export async function sendPushNotifications(
  userId: string,
  criteriaName: string,
  listing: ApartmentListing
): Promise<void> {
  const tokensSnapshot = await db
    .collection("users")
    .doc(userId)
    .collection("fcmTokens")
    .get();

  if (tokensSnapshot.empty) return;

  const title = `Nouvelle annonce : ${listing.title}`;
  const details = [`${listing.price}€`, listing.city];
  if (listing.rooms) details.push(`${listing.rooms} pièces`);
  if (listing.surface) details.push(`${listing.surface} m²`);
  const body = `${details.join(" · ")} — critère « ${criteriaName} »`;

  const messaging = getMessaging(app);

  await Promise.all(
    tokensSnapshot.docs.map(async (tokenDoc) => {
      try {
        await messaging.send({
          token: tokenDoc.id,
          notification: { title, body },
          webpush: { fcmOptions: { link: listing.url } },
        });
      } catch (err: unknown) {
        const code = (err as { code?: string } | undefined)?.code;
        // Token expiré/désinstallé côté navigateur : on le retire pour ne
        // pas continuer à échouer dessus à chaque exécution.
        if (
          code === "messaging/registration-token-not-registered" ||
          code === "messaging/invalid-registration-token"
        ) {
          await tokenDoc.ref.delete();
        } else {
          console.error(
            `[agent] échec envoi push (utilisateur ${userId}):`,
            err
          );
        }
      }
    })
  );
}
