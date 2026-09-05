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

// 🔹 Agent de recherche d'appartement
export type PropertyType = "appartement" | "maison" | "tous";

// Sites surveillés via navigateur automatisé côté scraper (voir scraper/README.md)
export type ExternalSource = "leboncoin" | "seloger";

// Un critère de recherche enregistré par l'utilisateur
export interface ApartmentCriteria {
  id: string;
  name: string;
  city: string;
  minPrice?: number;
  maxPrice: number;
  minRooms?: number;
  minSurface?: number;
  propertyType: PropertyType;
  // Optionnel: flux RSS d'un site/portail/alerte à surveiller pour ce critère
  feedUrl?: string;
  // Optionnel: sites à surveiller via l'agent externe (leboncoin/SeLoger)
  sources?: ExternalSource[];
  active: boolean;
  createdAt: Timestamp;
}

// Une annonce trouvée par une source (RSS, scraper HTML, saisie manuelle...)
export interface ApartmentListing {
  id: string;
  source: string;
  title: string;
  price: number;
  city: string;
  rooms?: number;
  surface?: number;
  url: string;
  imageUrl?: string;
  publishedAt?: string;
}

// Une notification in-app générée quand une annonce correspond à un critère
export interface ApartmentNotification {
  id: string;
  criteriaId: string;
  criteriaName: string;
  listing: ApartmentListing;
  read: boolean;
  createdAt: Timestamp;
}

// 🔹 Props du composant CriteriaForm
export interface CriteriaFormProps {
  addCriteria: (criteria: {
    name: string;
    city: string;
    minPrice?: number;
    maxPrice: number;
    minRooms?: number;
    minSurface?: number;
    propertyType: PropertyType;
    feedUrl?: string;
    sources?: ExternalSource[];
  }) => Promise<void>;
}

// 🔹 Props du composant CriteriaList
export interface CriteriaListProps {
  criteria: ApartmentCriteria[];
  toggleActive: (id: string, active: boolean) => Promise<void>;
  removeCriteria: (id: string) => Promise<void>;
}

// 🔹 Props du composant NotificationsList
export interface NotificationsListProps {
  notifications: ApartmentNotification[];
  markAsRead: (id: string) => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
}
