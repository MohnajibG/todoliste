/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/HomePage.tsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  auth,
  signInWithPopup,
  googleProvider,
  // facebookProvider,
  // githubProvider,
  // appleProvider,
  // microsoftProvider,
} from "../utils/firebase";

// Icônes modernes avec react-icons
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub, FaApple, FaMicrosoft } from "react-icons/fa";
import Footer from "../components/Footer";

export default function HomePage() {
  const navigate = useNavigate();

  // Fonction de connexion
  const handleLogin = async (provider: any) => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/todos");
    } catch (err) {
      console.error("Erreur connexion:", err);
    }
  };

  // Variants Framer Motion
  const buttonVariants = {
    initial: { scale: 1, opacity: 0, y: 30 },
    animate: { scale: 1, opacity: 1, y: 0 },
    hover: { scale: 1.1, boxShadow: "0px 0px 12px rgba(255,255,255,0.5)" },
    tap: { scale: 0.95 },
  };

  return (
    <main className="flex flex-col ">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-red-900 p-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="p-12 bg-white/10 shadow-2xl text-center space-y-8 backdrop-blur-lg border border-white/20 w-full max-w-lg"
        >
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Bienvenue sur <span className="text-red-500">To-Do</span>
          </h1>

          <h2 className="text-xl font-semibold text-gray-200 uppercase tracking-wide">
            Connectez-vous
          </h2>

          <div className="grid grid-cols-3 gap-6 justify-items-center">
            {/* Google (actif) */}
            <motion.button
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleLogin(googleProvider)}
              className="w-20 h-20 flex items-center justify-center rounded-full bg-white text-gray-900 shadow-lg"
            >
              <FcGoogle size={36} />
            </motion.button>

            {/* Facebook (désactivé) */}
            <motion.button
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              disabled
              className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-400 text-white shadow-lg cursor-not-allowed opacity-50"
            >
              <FaFacebook size={32} />
            </motion.button>

            {/* GitHub (désactivé) */}
            <motion.button
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              disabled
              className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-400 text-white shadow-lg cursor-not-allowed opacity-50"
            >
              <FaGithub size={32} />
            </motion.button>

            {/* Apple (désactivé) */}
            <motion.button
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              disabled
              className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-400 text-white shadow-lg cursor-not-allowed opacity-50"
            >
              <FaApple size={32} />
            </motion.button>

            {/* Microsoft (désactivé) */}
            <motion.button
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              disabled
              className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-400 text-white shadow-lg cursor-not-allowed opacity-50"
            >
              <FaMicrosoft size={32} />
            </motion.button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}
