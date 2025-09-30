import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
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

  // Liste des catégories enregistrées
  const [savedCategories, setSavedCategories] = useState<
    { name: string; color: string }[]
  >([]);

  // Sauvegarder une catégorie
  function saveCategory() {
    if (!categoryName.trim()) return;
    const exists = savedCategories.find(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase()
    );
    if (!exists) {
      setSavedCategories([
        ...savedCategories,
        { name: categoryName.trim(), color: categoryColor },
      ]);
    }
  }

  // Supprimer une catégorie
  function deleteCategory(name: string) {
    setSavedCategories(savedCategories.filter((c) => c.name !== name));
  }

  return (
    <div className="flex flex-col gap-2 relative w-full sm:w-64">
      {/* Nom de la catégorie */}
      <div className="flex gap-2">
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Nom de la catégorie"
          className="flex-1 px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />
        <button
          type="button"
          onClick={saveCategory}
          className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          +
        </button>
      </div>

      {/* Menu burger pour choisir la couleur */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 border rounded w-full justify-between dark:bg-gray-800 dark:text-white"
      >
        <span>Choisir la couleur</span>
        {open ? <FiChevronUp /> : <FiChevronDown />}
      </button>

      {/* Palette de couleurs animée */}
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
              {defaultColors.map((color, index) => (
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
                  transition={{ delay: index * 0.05 }}
                />
              ))}

              {/* Couleur personnalisée */}
              <motion.input
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  setCategoryColor(e.target.value);
                }}
                className="w-8 h-8 p-0 rounded-full border cursor-pointer"
                title="Choisir une couleur personnalisée"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liste des catégories enregistrées */}
      {savedCategories.length > 0 && (
        <div className="mt-2 border rounded p-2 bg-gray-50 dark:bg-gray-800">
          <p className="text-sm font-semibold mb-1">
            Catégories enregistrées :
          </p>
          <ul className="flex flex-col gap-1">
            {savedCategories.map((cat) => (
              <li
                key={cat.name}
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
                  onClick={() => deleteCategory(cat.name)}
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
