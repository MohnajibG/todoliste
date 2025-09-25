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
      const tasks = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Todo[];
      setTodos(tasks);
    });

    return () => unsubscribe();
  }, [user]);

  // Ajouter une todo dans Firestore
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

  // Supprimer une todo
  async function removeTodo(id: string) {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "tasks", id));
  }

  // Changer le statut cycliquement (todo -> doing -> done -> todo)
  async function cycleStatus(id: string) {
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
  }

  // Déplacer une tâche dans une colonne spécifique
  async function moveToColumn(
    todoId: string,
    newStatus: "todo" | "doing" | "done"
  ) {
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid, "tasks", todoId), {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
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
          <Header dark={dark} setDark={setDark} />

          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm  p-6 shadow-lg">
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
