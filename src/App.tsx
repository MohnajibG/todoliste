// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./utils/useAuth";
import TodoListPage from "./pages/TodoListPage";
import type { JSX } from "react";
import HomePage from "./pages/Home";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/todos"
        element={
          <PrivateRoute>
            <TodoListPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
