import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import type { TodoFormProps } from "../../types";
import CategorySelector from "./CategorySelector";

export default function TodoForm({ text, setText, addTodo }: TodoFormProps) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("#EF4444");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    await addTodo({
      text: text.trim(),
      category: {
        name: categoryName || "Sans catégorie",
        color: categoryColor,
      },
    });

    setText("");
    setCategoryName("");
    setCategoryColor("#EF4444");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-4 items-center w-full"
    >
      {/* Champ texte tâche */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Écrire une tâche..."
        className="w-full sm:flex-1 min-w-0 px-4 py-2 rounded border 
             focus:ring-2 focus:ring-red-500 
             text-sm sm:text-base
             dark:bg-gray-800 dark:text-white"
      />

      {/* Sélecteur de catégorie */}
      <CategorySelector
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        categoryColor={categoryColor}
        setCategoryColor={setCategoryColor}
      />

      {/* Bouton avec icône Plus */}
      <button
        type="submit"
        className="p-3 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition flex items-center justify-center"
      >
        <FiPlus size={30} />
      </button>
    </form>
  );
}
