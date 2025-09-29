import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import TodoForm from "../components/TodoForm";
import TodoColumn from "../components/TodoColumn";
import Header from "../components/Header";
import type { Todo } from "../../types";

import {
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { useAuth } from "../utils/useAuth";
import { db } from "../utils/firebase";

export default function TodoListPage() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return (
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  // 🔹 Gestion thème
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // 🔹 Récupérer les todos depuis Firestore
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "tasks"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Todo[];

      tasks.sort((a, b) => {
        if (b.priority !== a.priority) return b.priority - a.priority;
        return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      });

      setTodos(tasks);
    });

    return () => unsubscribe();
  }, [user]);

  // 🔹 Supprimer une todo
  const removeTodo = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "tasks", id));
  };

  // 🔹 Mettre à jour la priorité
  const updatePriority = async (id: string, priority: number) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid, "tasks", id), {
      priority,
      updatedAt: serverTimestamp(),
    });
  };

  // 🔹 Changer le statut cycliquement
  const cycleStatus = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo || !user) return;

    const nextStatus =
      todo.status === "todo"
        ? "doing"
        : todo.status === "doing"
        ? "done"
        : "todo";

    await updateDoc(doc(db, "users", user.uid, "tasks", id), {
      status: nextStatus,
      done: nextStatus === "done",
      updatedAt: serverTimestamp(),
    });
  };

  // 🔹 Ajouter une todo dans Firestore
  const addTodoFirestore = async (newTodo: {
    text: string;
    category: { name: string; color: string };
  }) => {
    if (!user || !newTodo.text.trim()) return;

    await addDoc(collection(db, "users", user.uid, "tasks"), {
      text: newTodo.text.trim(),
      status: "todo",
      priority: 0,
      category: newTodo.category,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  // 🔹 Déplacer une tâche dans une colonne
  const moveToColumn = async (
    todoId: string,
    newStatus: "todo" | "doing" | "done"
  ) => {
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid, "tasks", todoId), {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
  };

  const columns = [
    {
      status: "todo",
      title: "TODO",
      color:
        "text-red-600 dark:text-red-400 text-lg text-center font-bold border-b-2 border-red-600 dark:border-red-400 pb-5",
    },
    {
      status: "doing",
      title: "DOING",
      color:
        "text-red-700 dark:text-red-500 text-lg text-center font-bold border-b-2 border-red-700 dark:border-red-500 pb-5",
    },
    {
      status: "done",
      title: "DONE",
      color:
        "text-red-900 dark:text-red-600 text-lg text-center font-bold border-b-2 border-red-700 dark:border-red-500 pb-5",
    },
  ] as const;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-red-500 to-black p-6">
        <div className="w-full max-w-6xl space-y-6">
          <Header dark={dark} setDark={setDark} />

          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 shadow-lg">
            <TodoForm
              text={text}
              setText={setText}
              addTodo={addTodoFirestore}
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
                  updatePriority={updatePriority}
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
