import { useState, useEffect, useMemo, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "./firebase";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  // Sans useMemo, ce littéral objet est recréé à chaque rendu de
  // AuthProvider: tout composant qui met `user` en dépendance d'un
  // useEffect (Header, AgentPage, TodoListPage...) le relancerait alors
  // à chaque rendu, même quand l'utilisateur réel n'a pas changé.
  const value = useMemo(() => ({ user }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
