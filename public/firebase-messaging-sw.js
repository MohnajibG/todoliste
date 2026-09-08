// Service worker Firebase Cloud Messaging : reçoit les notifications push
// de l'agent appartement même quand l'onglet/l'app est fermé.
//
// Chargé en dehors du bundle Vite (dossier public/), donc pas d'accès à
// import.meta.env : la config Firebase ci-dessous est copiée depuis
// `.env` à la racine. Ce sont des identifiants publics du projet Firebase
// (pas des secrets, ils sont de toute façon envoyés au navigateur dans le
// bundle de l'app) — la sécurité réelle vient des règles Firestore.
importScripts("https://www.gstatic.com/firebasejs/12.3.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.3.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDoXoklbXvw3Fr5EOD4NnO9vAhjtqsIgUg",
  authDomain: "todo-db2d4.firebaseapp.com",
  projectId: "todo-db2d4",
  storageBucket: "todo-db2d4.appspot.com",
  messagingSenderId: "313631889743",
  appId: "1:313631889743:web:883e3031d0b7a0090ecd3a",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? "Nouvelle annonce";
  const body = payload.notification?.body ?? "";
  const url = payload.fcmOptions?.link ?? payload.data?.link ?? "/agent";

  self.registration.showNotification(title, {
    body,
    icon: "/logotodo.png",
    data: { url },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/agent";
  event.waitUntil(self.clients.openWindow(url));
});
