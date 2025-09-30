import { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../utils/firebase"; // config Firebase
import type { CategorySelectorProps } from "../../types";

const defaultColors = [
  "#EF4444",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#FBBF24",
  "#6366F1",
  "#4B5563",
  "#22D3EE",
  "#E11D48",
];

export default function CategorySelector({
  categoryName,
  setCategoryName,
  categoryColor,
  setCategoryColor,
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [customColor, setCustomColor] = useState("#EF4444");
  const [savedCategories, setSavedCategories] = useState<
    { id: string; name: string; color: string }[]
  >([]);

  const COLLECTION = "categories";

  // 🔹 Load categories from Firestore and localStorage
  useEffect(() => {
    // 1️⃣ Load from localStorage
    const localCats = localStorage.getItem("categories");
    if (localCats) setSavedCategories(JSON.parse(localCats));

    // 2️⃣ Listen to Firestore in real-time
    const unsubscribe = onSnapshot(collection(db, COLLECTION), (snapshot) => {
      const cats: { id: string; name: string; color: string }[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as { name: string; color: string };
        if (data.name && data.color) {
          cats.push({ id: docSnap.id, name: data.name, color: data.color });
        }
      });
      setSavedCategories(cats);
      localStorage.setItem("categories", JSON.stringify(cats));
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Save a new category
  const saveCategory = async () => {
    const name = categoryName.trim();
    if (!name) return;

    const exists = savedCategories.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) return;

    const newCat = { name, color: categoryColor };
    try {
      await addDoc(collection(db, COLLECTION), newCat);
      // Firestore onSnapshot updates state & localStorage automatically
      setCategoryName("");
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  // 🔹 Delete a category
  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, COLLECTION, id));
      // Firestore onSnapshot updates state & localStorage automatically
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2 relative w-full sm:w-64">
      {/* Input for category name */}
      <div className="relative w-full">
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Category name"
          className="flex-1 px-3 py-2 pr-10 rounded border focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white w-full"
        />
        <button
          type="button"
          onClick={saveCategory}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-green-600 text-lg font-bold rounded-full hover:text-green-400"
        >
          +
        </button>
      </div>

      {/* Toggle color palette */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 border rounded w-full justify-between dark:bg-gray-800 dark:text-white"
      >
        <span>Select color</span>
        {open ? <FiChevronUp /> : <FiChevronDown />}
      </button>

      {/* Animated color palette */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-2"
          >
            <div className="flex flex-wrap gap-2 p-1">
              {defaultColors.map((color, idx) => (
                <motion.button
                  key={color}
                  type="button"
                  onClick={() => setCategoryColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition ${
                    categoryColor === color
                      ? "ring-2 ring-offset-1 ring-gray-500"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                />
              ))}

              {/* Custom color picker */}
              <motion.input
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  setCategoryColor(e.target.value);
                }}
                className="w-8 h-8 p-0 rounded-full border cursor-pointer"
                title="Pick a custom color"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved categories */}
      {savedCategories.length > 0 && (
        <div className="mt-2 border rounded p-2 bg-gray-50 dark:bg-gray-800">
          <p className="text-sm font-semibold mb-1">Saved categories:</p>
          <ul className="flex flex-col gap-1">
            {savedCategories.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <button
                  type="button"
                  onClick={() => {
                    setCategoryName(cat.name);
                    setCategoryColor(cat.color);
                  }}
                  className="flex items-center gap-2"
                >
                  <span
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: cat.color }}
                  ></span>
                  <span className="text-sm">{cat.name}</span>
                </button>
                <button
                  type="button"
                  onClick={() => deleteCategory(cat.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <IoClose size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
