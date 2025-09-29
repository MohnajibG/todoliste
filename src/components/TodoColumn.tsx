import { useDrop } from "react-dnd";
import { useState, useMemo } from "react";
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

  // ✅ sort mode: "time" (default), "priority", "category"
  const [sortMode, setSortMode] = useState<"time" | "priority" | "category">(
    "priority"
  );

  // ✅ sorting logic
  const sortedTodos = useMemo(() => {
    const sorted = [...todos];

    if (sortMode === "priority") {
      sorted.sort(
        (a, b) =>
          b.priority - a.priority || a.createdAt.seconds - b.createdAt.seconds
      );
    } else if (sortMode === "time") {
      sorted.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
    } else if (sortMode === "category") {
      sorted.sort((a, b) =>
        (a.category?.name || "").localeCompare(b.category?.name || "")
      );
    }

    return sorted;
  }, [todos, sortMode]);

  // ✅ group by category if needed
  const groupedByCategory = useMemo(() => {
    if (sortMode !== "category") return {};
    return sortedTodos.reduce((acc, todo) => {
      const cat = todo.category?.name || "No category";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(todo);
      return acc;
    }, {} as Record<string, typeof todos>);
  }, [sortedTodos, sortMode]);

  return (
    <div
      ref={drop as unknown as React.LegacyRef<HTMLDivElement>}
      className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 shadow-lg min-h-auto transition-all hover:shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={`font-semibold text-lg ${color}`}>{title}</h2>

        {/* ✅ Sorting filters */}
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 pl-2">
          <label>
            <input
              type="radio"
              name={`sort-${status}`}
              checked={sortMode === "priority"}
              onChange={() => setSortMode("priority")}
            />{" "}
            Priority
          </label>
          <label>
            <input
              type="radio"
              name={`sort-${status}`}
              checked={sortMode === "time"}
              onChange={() => setSortMode("time")}
            />{" "}
            Chronological
          </label>
          <label>
            <input
              type="radio"
              name={`sort-${status}`}
              checked={sortMode === "category"}
              onChange={() => setSortMode("category")}
            />{" "}
            Category
          </label>
        </div>
      </div>

      {todos.length ? (
        sortMode === "category" ? (
          // ✅ grouped by category
          Object.entries(groupedByCategory).map(([catName, catTodos]) => (
            <div key={catName} className="mb-4">
              <h3 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">
                {catName}
              </h3>
              {catTodos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  removeTodo={removeTodo}
                  cycleStatus={cycleStatus}
                  updatePriority={updatePriority}
                />
              ))}
            </div>
          ))
        ) : (
          // ✅ simple sorted list
          sortedTodos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              removeTodo={removeTodo}
              cycleStatus={cycleStatus}
              updatePriority={updatePriority}
            />
          ))
        )
      ) : (
        <p className="text-center py-8 text-gray-700 dark:text-gray-400">
          No tasks
        </p>
      )}
    </div>
  );
}
