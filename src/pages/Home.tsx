/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/HomePage.tsx
import { useNavigate } from "react-router-dom";
import {
  auth,
  signInWithPopup,
  googleProvider,
  facebookProvider,
} from "../utils/firebase"; // attention au chemin (../firebase et pas ./firebase)

export default function HomePage() {
  const navigate = useNavigate();

  // Fonction générique pour tous les providers
  const handleLogin = async (provider: any) => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/todos");
    } catch (err) {
      console.error("Erreur connexion:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 to-black p-4">
      <div className="p-10 bg-white/50 shadow-lg text-center space-y-6 backdrop-blur-md rounded-xl">
        <h1 className="text-3xl font-bold text-red-600">Bienvenue sur To-Do</h1>

        <h2 className="text-2xl text-amber-300/70 font-bold text-center shadow-2xl p-2 rounded-lg">
          Se connecter
        </h2>

        {/* Google login */}
        <button
          onClick={() => handleLogin(googleProvider)}
          className="flex justify-center mx-auto"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google login"
            className="w-12 h-12 p-2 bg-amber-100/25 hover:bg-amber-100/50 rounded-full shadow-md hover:scale-110 transition-transform"
          />
        </button>

        {/* Facebook login */}
        <button
          onClick={() => handleLogin(facebookProvider)}
          className="flex justify-center mx-auto"
        >
          <img
            src="https://upload.wikimedia.org/brandhub/FB/facebook-icon.svg"
            alt="Facebook login"
            className="w-14 h-14 rounded-full shadow-md hover:scale-110 transition-transform"
          />
        </button>
      </div>
    </div>
  );
}
