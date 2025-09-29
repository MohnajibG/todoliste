import type { Timestamp } from "firebase/firestore";

// 🔹 Une tâche
export interface Todo {
  id: string;
  text: string;
  createdAt: Timestamp;
  status: "todo" | "doing" | "done";
  priority: number;
  done?: boolean;
  category?: {
    name: string;
    color: string;
  };
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
  addTodo: (newTodo: {
    text: string;
    category: { name: string; color: string };
  }) => Promise<void>;
}

// 🔹 Props du composant TodoCard
export interface TodoCardProps {
  todo: Todo;
  removeTodo: (id: string) => Promise<void>;
  cycleStatus: (id: string) => Promise<void>;
  updatePriority: (id: string, priority: number) => Promise<void>;
}

// 🔹 Props du composant CategorySelector
export interface CategorySelectorProps {
  categoryName: string;
  setCategoryName: (name: string) => void;
  categoryColor: string;
  setCategoryColor: (color: string) => void;
}
