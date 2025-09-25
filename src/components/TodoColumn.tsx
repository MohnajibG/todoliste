import { useDrop } from "react-dnd";
import TodoCard from "./TodoCard";
import type { Todo } from "../../types";

interface Props {
  status: "todo" | "doing" | "done";
  title: string;
  color: string;
  todos: Todo[];
  moveToColumn: (todoId: string, newStatus: "todo" | "doing" | "done") => void;
  removeTodo: (id: string) => void;
  cycleStatus: (id: string) => void;
}

export default function TodoColumn({
  status,
  title,
  color,
  todos,
  moveToColumn,
  removeTodo,
  cycleStatus,
}: Props) {
  const [, drop] = useDrop({
    accept: "TODO",
    drop: (item: { id: string }) => {
      moveToColumn(item.id, status);
    },
  });

  return (
    <div
      ref={drop as unknown as React.LegacyRef<HTMLDivElement>}
      className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 shadow-lg  min-h-auto  transition-all hover:shadow-2xl"
    >
      <h2 className={`font-semibold text-lg mb-4 ${color}`}>{title}</h2>
      {todos.length ? (
        todos.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            removeTodo={removeTodo}
            cycleStatus={cycleStatus}
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
