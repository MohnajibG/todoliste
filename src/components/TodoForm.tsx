import { useState } from "react";
import { FiPlus } from "react-icons/fi";

interface Props {
  text: string;
  setText: (text: string) => void;
  addTodo: () => Promise<void>;
}

export default function TodoForm({ text, setText, addTodo }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    await addTodo(); // ici addTodo peut être addTodoFirestore
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full md:flex md:items-center"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ajouter une tâche..."
        className="w-full px-4 py-3 pr-12 md:pr-16 bg-white bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-20 text-red-600 dark:text-red-400 placeholder-red-300 dark:placeholder-red-200 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors  bg-shadow-2xl"
      />

      {/* Button inside input for mobile */}
      <button
        type="submit"
        disabled={loading}
        className="absolute right-2 top-1/2 -translate-y-1/2 md:hidden flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-full shadow hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiPlus />
      </button>

      {/* Button next to input for desktop */}
      <button
        type="submit"
        disabled={loading}
        className="hidden md:flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-full shadow hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed ml-4 md:px-3 "
      >
        <FiPlus />
      </button>
    </form>
  );
}
