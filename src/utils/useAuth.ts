// src/utils/useAuth.ts
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// Hook séparé pour accéder au contexte
export const useAuth = () => useContext(AuthContext);
