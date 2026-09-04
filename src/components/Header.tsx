import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiSun, FiMoon, FiLogOut, FiBell, FiCheckSquare } from "react-icons/fi";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, signOut, db } from "../utils/firebase";
import { useAuth } from "../utils/useAuth";

interface HeaderProps {
  dark: boolean;
  setDark: (value: boolean) => void;
}

export default function Header({ dark, setDark }: HeaderProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const firstName = user?.displayName
    ? user.displayName.split(" ")[0]
    : "Utilisateur";

  // 🔹 Compte les notifications d'appartement non lues (visible sur tout l'app)
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "apartmentNotifications"),
      where("read", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadCount(snapshot.size);
    });

    return () => unsubscribe();
  }, [user]);

  const avatarUrl = user?.photoURL
    ? user.photoURL
    : `https://ui-avatars.com/api/?name=${firstName}&background=ff0000&color=ffffff&size=128`;

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Erreur déconnexion:", err);
    }
  }

  return (
    <header className="flex flex-col items-center gap-6 my-4 md:my-10">
      {/* Logo en haut */}
      <h1 className="text-6xl font-bold">TODO</h1>
      <img
        src="/logotodo.png"
        alt="Logo ToDo"
        className="w-30 h-30 object-contain"
      />

      {/* Menu principal */}
      <nav className="flex gap-3 w-full max-w-md">
        <Link
          to="/todos"
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
            location.pathname === "/todos"
              ? "bg-white text-red-600"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          <FiCheckSquare size={18} />
          Todos
        </Link>

        <Link
          to="/agent"
          className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 ${
            location.pathname === "/agent"
              ? "bg-white text-red-600"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          <FiBell size={18} />
          Agent
          {unreadCount > 0 && (
            <span className="absolute -top-1 right-2 flex items-center justify-center w-5 h-5 text-xs font-bold bg-red-600 text-white rounded-full ring-2 ring-black/40">
              {unreadCount}
            </span>
          )}
        </Link>
      </nav>

      {/* Partie profil + actions */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <img
            key={avatarUrl}
            src={avatarUrl}
            alt={firstName}
            className="w-10 h-10 rounded-full"
          />

          <h1 className="text-2xl font-bold text-white">{firstName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full border border-white/70 hover:bg-white/20 text-white transition-all duration-200 hover:scale-105"
          >
            {dark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-full border border-red-600/70 hover:bg-red-600/20 bg-white text-red-600 transition-all duration-200 hover:scale-105"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
