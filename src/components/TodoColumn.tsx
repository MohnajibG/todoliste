import { useDrop } from "react-dnd";
import TodoCard from "./TodoCard";
import type { TodoColumnProps } from "../../types";

export default function TodoColumn({
  status,
  title,
  color,
  todos,
  moveToColumn,
  removeTodo,
  cycleStatus,
  updatePriority,
}: TodoColumnProps) {
  const [, drop] = useDrop({
    accept: "TODO",
    drop: (item: { id: string }) => {
      moveToColumn(item.id, status);
    },
  });

  return (
    <div
      ref={drop as unknown as React.LegacyRef<HTMLDivElement>}
      className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 shadow-lg min-h-auto transition-all hover:shadow-2xl"
    >
      <h2 className={`font-semibold text-lg mb-4 ${color}`}>{title}</h2>
      {todos.length ? (
        todos.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            removeTodo={removeTodo}
            cycleStatus={cycleStatus}
            updatePriority={updatePriority} // ✅ passe la prop
          />
        ))
      ) : (
        <p className="text-center py-8 text-gray-700 dark:text-gray-400">
          Aucune tâche
        </p>
      )}
    </div>
  );
}
