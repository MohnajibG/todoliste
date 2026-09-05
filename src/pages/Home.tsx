/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/HomePage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth, signInWithPopup, googleProvider } from "../utils/firebase";

// Modern icons with react-icons
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub, FaApple, FaMicrosoft } from "react-icons/fa";
import { FiCheckSquare, FiBell } from "react-icons/fi";
import Footer from "../components/Footer";

export default function HomePage() {
  const navigate = useNavigate();

  // 🔹 Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/todos");
    }
  }, [navigate]);

  // 🔹 Login function
  const handleLogin = async (provider: any) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store user in localStorage to persist login
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      );

      navigate("/todos");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  // Framer Motion variants for buttons
  const buttonVariants = {
    initial: { scale: 1, opacity: 0, y: 30 },
    animate: { scale: 1, opacity: 1, y: 0 },
    hover: { scale: 1.1, boxShadow: "0px 0px 12px rgba(255,255,255,0.5)" },
    tap: { scale: 0.95 },
  };

  const features = [
    {
      icon: <FiCheckSquare className="text-red-500" size={26} />,
      title: "Tâches",
      description:
        "Organisez votre quotidien avec des colonnes To Do / Doing / Done, priorités et catégories.",
    },
    {
      icon: <FiBell className="text-red-500" size={26} />,
      title: "Agent appartement",
      description:
        "Créez des alertes selon vos critères (ville, budget, pièces) et recevez une notification dès qu'une annonce correspond.",
    },
  ];

  return (
    <main className="flex flex-col">
      <div className="min-h-screen flex flex-col items-center justify-center gap-10 bg-gradient-to-br from-gray-900 via-black to-red-900 p-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-4 max-w-xl"
        >
          <img
            src="/logotodo.png"
            alt="Logo Sacha"
            className="w-20 h-20 mx-auto object-contain"
          />
          <h1 className="text-5xl font-extrabold text-white tracking-tight">
            Sacha
          </h1>
          <p className="text-lg text-gray-300">
            Organisez vos tâches, ne ratez plus une bonne annonce.
          </p>
        </motion.div>

        {/* Fonctionnalités */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl"
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-3 p-4 bg-white/10 border border-white/20 backdrop-blur-lg text-left"
            >
              <div className="mt-1">{feature.icon}</div>
              <div>
                <h3 className="font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-gray-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Connexion */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="p-10 bg-white/10 shadow-2xl text-center space-y-6 backdrop-blur-lg border border-white/20 w-full max-w-lg"
        >
          <h2 className="text-lg font-semibold text-gray-200 uppercase tracking-wide">
            Connexion
          </h2>

          <div className="grid grid-cols-3 gap-6 justify-items-center">
            {/* Google (active) */}
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

            {/* Facebook (disabled) */}
            <motion.button
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              disabled
              className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-400 text-white shadow-lg cursor-not-allowed opacity-50"
            >
              <FaFacebook size={32} />
            </motion.button>

            {/* GitHub (disabled) */}
            <motion.button
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              disabled
              className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-400 text-white shadow-lg cursor-not-allowed opacity-50"
            >
              <FaGithub size={32} />
            </motion.button>

            {/* Apple (disabled) */}
            <motion.button
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              disabled
              className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-400 text-white shadow-lg cursor-not-allowed opacity-50"
            >
              <FaApple size={32} />
            </motion.button>

            {/* Microsoft (disabled) */}
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
