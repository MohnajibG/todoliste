export interface Todo {
  id: string;
  text: string;
  done: boolean;
  status: "todo" | "doing" | "done";
}
