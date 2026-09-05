import { useEffect, useState } from "react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import CriteriaForm from "../components/agent/CriteriaForm";
import CriteriaList from "../components/agent/CriteriaList";
import NotificationsList from "../components/agent/NotificationsList";
import Header from "../components/Header";
import type { ApartmentCriteria, ApartmentNotification, ExternalSource, PropertyType } from "../../types";

import { useAuth } from "../utils/useAuth";
import { db } from "../utils/firebase";

export default function AgentPage() {
  const { user } = useAuth();
  const [criteria, setCriteria] = useState<ApartmentCriteria[]>([]);
  const [notifications, setNotifications] = useState<ApartmentNotification[]>(
    []
  );
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return (
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // 🔹 Critères de recherche de l'utilisateur
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "apartmentCriteria"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as ApartmentCriteria[];
      setCriteria(items);
    });

    return () => unsubscribe();
  }, [user]);

  // 🔹 Notifications (annonces trouvées) de l'utilisateur
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "apartmentNotifications"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as ApartmentNotification[];
      setNotifications(items);
    });

    return () => unsubscribe();
  }, [user]);

  const addCriteria = async (newCriteria: {
    name: string;
    city: string;
    minPrice?: number;
    maxPrice: number;
    minRooms?: number;
    minSurface?: number;
    propertyType: PropertyType;
    feedUrl?: string;
    sources?: ExternalSource[];
  }) => {
    if (!user) return;

    // Firestore rejette les champs à `undefined` (minPrice/minRooms/...
    // quand le champ optionnel est laissé vide dans le formulaire).
    const cleaned = Object.fromEntries(
      Object.entries(newCriteria).filter(([, value]) => value !== undefined)
    );

    await addDoc(collection(db, "users", user.uid, "apartmentCriteria"), {
      ...cleaned,
      active: true,
      createdAt: serverTimestamp(),
    });
  };

  const toggleActive = async (id: string, active: boolean) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid, "apartmentCriteria", id), {
      active,
    });
  };

  const removeCriteria = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "apartmentCriteria", id));
  };

  const markAsRead = async (id: string) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid, "apartmentNotifications", id), {
      read: true,
    });
  };

  const removeNotification = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "apartmentNotifications", id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-red-500 to-black p-6">
      <div className="w-full max-w-6xl space-y-6">
        <Header dark={dark} setDark={setDark} />

        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 shadow-lg space-y-4">
          <h2 className="font-semibold text-lg text-red-600 dark:text-red-400">
            Nouvelle alerte appartement
          </h2>
          <CriteriaForm addCriteria={addCriteria} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 shadow-lg space-y-4">
            <h2 className="font-semibold text-lg text-red-600 dark:text-red-400">
              Mes critères
            </h2>
            <CriteriaList
              criteria={criteria}
              toggleActive={toggleActive}
              removeCriteria={removeCriteria}
            />
          </div>

          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 shadow-lg space-y-4">
            <h2 className="font-semibold text-lg text-red-600 dark:text-red-400">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-sm bg-red-600 text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </h2>
            <NotificationsList
              notifications={notifications}
              markAsRead={markAsRead}
              removeNotification={removeNotification}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
