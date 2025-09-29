import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
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

  return (
    <div className="flex flex-col gap-2 relative w-full sm:w-64">
      {/* Nom de la catégorie */}
      <input
        type="text"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        placeholder="Nom de la catégorie"
        className="px-3 py-2 rounded border focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white w-full"
      />

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

      {/* Affichage pastille choisie */}
      {categoryName && categoryColor && (
        <motion.div
          className="flex items-center gap-2 mt-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span
            className="w-4 h-4 rounded-full border"
            style={{ backgroundColor: categoryColor }}
          ></span>
          <span className="text-sm">{categoryName}</span>
        </motion.div>
      )}
    </div>
  );
}
