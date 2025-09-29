import { Timestamp } from "firebase/firestore";

// 🔹 Représente une tâche seule (juste les données)
export interface Todo {
  id: string;
  text: string;
  createdAt: Timestamp;
  status: "todo" | "doing" | "done";
  priority: number; // 0 à 3 étoiles
  done?: boolean; // optionnel si tu veux gérer le check
}

// 🔹 Props du composant TodoColumn
export interface TodoColumnProps {
  status: "todo" | "doing" | "done";
  title: string;
  color: string;
  todos: Todo[];
  updatePriority: (id: string, priority: number) => Promise<void>;
  moveToColumn: (
    todoId: string,
    newStatus: "todo" | "doing" | "done"
  ) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
  cycleStatus: (id: string) => Promise<void>;
}

// 🔹 Props du composant TodoForm
export interface TodoFormProps {
  text: string;
  setText: (text: string) => void;
  addTodo: () => Promise<void>;
}

// 🔹 Props du composant TodoCard
export interface TodoCardProps {
  todo: Todo;
  removeTodo: (id: string) => Promise<void>;
  cycleStatus: (id: string) => Promise<void>;
  updatePriority: (id: string, priority: number) => Promise<void>;
}
