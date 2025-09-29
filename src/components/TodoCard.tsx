import { useDrag } from "react-dnd";
import { FiCheck, FiTrash2 } from "react-icons/fi";
import type { TodoCardProps } from "../../types";

export default function TodoCard({
  todo,
  removeTodo,
  cycleStatus,
  updatePriority, // ✅ ajouté
}: TodoCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "TODO",
    item: { id: todo.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  return (
    <div
      ref={drag as unknown as React.LegacyRef<HTMLDivElement>}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800 shadow-md rounded-xl mb-2 cursor-move"
    >
      <span
        onClick={() => cycleStatus(todo.id)}
        className={`flex-1 cursor-pointer select-none ${
          todo.done
            ? "line-through text-gray-400"
            : todo.status === "doing"
            ? "text-yellow-500 dark:text-yellow-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {todo.text}
      </span>

      {/* ✅ Gestion de la priorité */}
      <div className="flex items-center gap-1 mr-3">
        {[1, 2, 3].map((level) => (
          <span
            key={level}
            onClick={() => updatePriority(todo.id, level)}
            className={`cursor-pointer text-lg ${
              todo.priority >= level
                ? "text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          >
            ★
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {todo.done && <FiCheck className="text-green-500" />}
        <FiTrash2
          onClick={() => removeTodo(todo.id)}
          className="text-gray-600 dark:text-gray-300 hover:text-red-500 cursor-pointer"
        />
      </div>
    </div>
  );
}
