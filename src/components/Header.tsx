import { FiSun, FiMoon, FiLogOut } from "react-icons/fi";
import { auth, signOut } from "../utils/firebase";
import { useAuth } from "../utils/useAuth";

interface HeaderProps {
  dark: boolean;
  setDark: (value: boolean) => void;
}

export default function Header({ dark, setDark }: HeaderProps) {
  const { user } = useAuth();
  const firstName = user?.displayName
    ? user.displayName.split(" ")[0]
    : "Utilisateur";

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
