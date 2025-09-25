import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TodoForm from "../components/TodoForm";
import TodoColumn from "../components/TodoColumn";
import type { Todo } from "../../types";
import { initialTodos } from "../components/Initialtodos";

import { useAuth } from "../utils/useAuth"; // 👈 Hook auth
import { auth, signOut } from "../utils/firebase"; // 👈 logout

const LOCAL_KEY = "todo_v3";

export default function TodoListPage() {
  const { user } = useAuth(); // 👈 récupérer l'utilisateur
  const firstName = user?.displayName
    ? user.displayName.split(" ")[0]
    : "Utilisateur";

  const [todos, setTodos] = useState<Todo[]>(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return initialTodos;
    try {
      const parsed = JSON.parse(raw) as Todo[];
      return parsed.length ? parsed : initialTodos;
    } catch {
      return initialTodos;
    }
  });

  const [text, setText] = useState("");
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return (
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(todos));
  }, [todos]);

  function addTodo() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((s) => [
      { id: Date.now().toString(), text: trimmed, done: false, status: "todo" },
      ...s,
    ]);
    setText("");
  }

  function removeTodo(id: string) {
    setTodos((s) => s.filter((t) => t.id !== id));
  }

  function cycleStatus(id: string) {
    setTodos((s) =>
      s.map((t) => {
        if (t.id !== id) return t;
        const nextStatus =
          t.status === "todo"
            ? "doing"
            : t.status === "doing"
            ? "done"
            : "todo";
        return { ...t, status: nextStatus, done: nextStatus === "done" };
      })
    );
  }

  function moveToColumn(todoId: string, newStatus: "todo" | "doing" | "done") {
    setTodos((s) =>
      s.map((t) => (t.id === todoId ? { ...t, status: newStatus } : t))
    );
  }

  const columns = [
    {
      status: "todo",
      title: "À faire",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      status: "doing",
      title: "En cours",
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      status: "done",
      title: "Terminé",
      color: "text-green-600 dark:text-green-400",
    },
  ] as const;

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Erreur déconnexion:", err);
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-red-500 to-black p-6">
        <div className="w-full max-w-6xl space-y-6">
          <header className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-white">
              Bonjour <span className="text-amber-300">{firstName}</span>
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDark(!dark)}
                className="px-3 py-2 rounded-full border border-white/70 hover:bg-white/20 text-white transition-all duration-200 hover:scale-105"
              >
                {dark ? "☀️" : "🌙"}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Déconnexion
              </button>
            </div>
          </header>

          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <TodoForm text={text} setText={setText} addTodo={addTodo} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {columns.map((col) => {
              const colTodos = todos.filter((t) => t.status === col.status);
              return (
                <TodoColumn
                  key={col.status}
                  status={col.status}
                  title={col.title}
                  color={col.color}
                  todos={colTodos}
                  moveToColumn={moveToColumn}
                  removeTodo={removeTodo}
                  cycleStatus={cycleStatus}
                />
              );
            })}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
