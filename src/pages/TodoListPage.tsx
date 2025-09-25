import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TodoForm from "../components/TodoForm";
import TodoColumn from "../components/TodoColumn";
import type { Todo } from "../../types";

import {
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { useAuth } from "../utils/useAuth";
import { auth, signOut, db } from "../utils/firebase";

export default function TodoListPage() {
  const { user } = useAuth();
  const firstName = user?.displayName
    ? user.displayName.split(" ")[0]
    : "Utilisateur";

  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return (
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  // Gestion thème
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // Récupérer les todos depuis Firestore
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "tasks"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Todo[];
      setTodos(tasks);
    });

    return () => unsubscribe();
  }, [user]);

  // Ajout d'une todo dans Firestore
  async function addTodoFirestore(text: string) {
    if (!user || !text.trim()) return;
    await addDoc(collection(db, "users", user.uid, "tasks"), {
      text: text.trim(),
      status: "todo",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
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

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Erreur déconnexion:", err);
    }
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
            <TodoForm
              text={text}
              setText={setText}
              addTodo={() => addTodoFirestore(text)}
            />
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
