import { useState } from "react";
import type { TodoFormProps } from "../../types";

export default function TodoForm({ text, setText, addTodo }: TodoFormProps) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("#FF5733");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await addTodo({
      text,
      category: {
        name: categoryName || "Sans catégorie",
        color: categoryColor,
      },
    });
    setText("");
    setCategoryName("");
    setCategoryColor("#FF5733");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-4 items-center"
    >
      {/* Texte de la tâche */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nouvelle tâche..."
        className="flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-white"
      />

      {/* Nom catégorie */}
      <input
        type="text"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        placeholder="Catégorie (ex: Travail)"
        className="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
      />

      {/* Choix couleur */}
      <input
        type="color"
        value={categoryColor}
        onChange={(e) => setCategoryColor(e.target.value)}
        className="w-12 h-10 p-1 rounded cursor-pointer border"
      />

      {/* Bouton */}
      <button
        type="submit"
        className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
      >
        Ajouter
      </button>
    </form>
  );
}
