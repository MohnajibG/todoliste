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
    <form onSubmit={handleSubmit} className="flex  gap-4">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ajouter une tâche..."
        className="flex-1 px-4 py-3 bg-white bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-20 text-red-600 dark:text-red-400 placeholder-red-300 dark:placeholder-red-200 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400  transition-colors"
      />
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-4 py-3 bg-red-600 dark:bg-red-500 text-white rounded-full shadow hover:bg-red-700 dark:hover:bg-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiPlus />
      </button>
    </form>
  );
}
