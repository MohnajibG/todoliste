import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  type Messaging,
} from "firebase/messaging";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { app, db } from "./firebase";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as
  | string
  | undefined;
const SW_PATH = "/firebase-messaging-sw.js";

let messagingPromise: Promise<Messaging | null> | null = null;

// `isSupported()` écarte les navigateurs sans Push API (ex: Safari iOS
// hors PWA installée) plutôt que de laisser `getMessaging` lever une
// exception.
function getMessagingInstance(): Promise<Messaging | null> {
  if (!messagingPromise) {
    messagingPromise = isSupported().then((supported) =>
      supported ? getMessaging(app) : null
    );
  }
  return messagingPromise;
}

export type EnablePushResult =
  | { status: "granted" }
  | { status: "denied" }
  | { status: "unsupported"; reason: string };

export async function enablePushNotifications(
  userId: string
): Promise<EnablePushResult> {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    return {
      status: "unsupported",
      reason: "Ce navigateur ne supporte pas les notifications push.",
    };
  }

  if (!VAPID_KEY) {
    return {
      status: "unsupported",
      reason:
        "Clé VAPID manquante (VITE_FIREBASE_VAPID_KEY dans .env). Voir README.",
    };
  }

  const messaging = await getMessagingInstance();
  if (!messaging) {
    return {
      status: "unsupported",
      reason: "Firebase Messaging n'est pas supporté par ce navigateur.",
    };
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return { status: "denied" };
  }

  const registration = await navigator.serviceWorker.register(SW_PATH);
  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  await setDoc(doc(db, "users", userId, "fcmTokens", token), {
    token,
    createdAt: serverTimestamp(),
    userAgent: navigator.userAgent,
  });

  return { status: "granted" };
}

export async function disablePushNotifications(userId: string) {
  const messaging = await getMessagingInstance();
  if (!messaging || !VAPID_KEY) return;

  const registration = await navigator.serviceWorker.getRegistration(
    SW_PATH
  );
  if (!registration) return;

  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  }).catch(() => null);

  if (token) {
    await deleteDoc(doc(db, "users", userId, "fcmTokens", token));
  }
}

// Écoute les messages reçus pendant que l'app est au premier plan : FCM
// n'affiche pas de notification système dans ce cas (contrairement au SW
// en arrière-plan), donc l'appelant décide quoi en faire (toast, etc.).
export async function listenForegroundPush(
  onNotification: (title: string, body: string, url?: string) => void
): Promise<() => void> {
  const messaging = await getMessagingInstance();
  if (!messaging) return () => {};

  return onMessage(messaging, (payload) => {
    onNotification(
      payload.notification?.title ?? "Nouvelle annonce",
      payload.notification?.body ?? "",
      payload.fcmOptions?.link ?? payload.data?.link
    );
  });
}
