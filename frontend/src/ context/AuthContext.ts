import { createContext, useContext } from "react";
import type { AuthContextType } from "../types/authTypes";

export const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => useContext(AuthContext);
