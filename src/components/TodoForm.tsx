import { FiPlus } from "react-icons/fi";

interface Props {
  text: string;
  setText: (text: string) => void;
  addTodo: () => void;
}

export default function TodoForm({ text, setText, addTodo }: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addTodo();
      }}
      className="flex gap-3 mb-6"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ajouter une tâche..."
        className="flex-1 px-4 py-3 bg-white bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-20 text-red-600 dark:text-red-400 placeholder-red-300 dark:placeholder-red-200 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-md transition-colors"
      />
      <button
        type="submit"
        className="flex items-center gap-2 px-6 py-3 bg-red-600 dark:bg-red-500 text-white rounded-3xl shadow hover:bg-red-700 dark:hover:bg-red-400 transition-all"
      >
        <FiPlus />
        Ajouter
      </button>
    </form>
  );
}
