// src/auth/AuthContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as api from "../api/auth";
import type { User } from "../types/types";

type AuthContextType = {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<{ mfaRequired: boolean; method?: "TOTP" | "EMAIL" | "SMS"; challengeId?: string }>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  // Al montar (o cuando cambia token) recupera el user
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const me = await api.getUser(token);
        setUser(me);
      } catch {
        // token inválido → limpiar
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      }
    })();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
  
    if ("mfaRequired" in res) {
      // NO guardes token todavía, porque no lo hay
      return { mfaRequired: true, method: res.method, challengeId: res.challengeId };
    }
  
    // Login normal
    setToken(res.token);
    localStorage.setItem("token", res.token);
    setUser(res.usuario);
  
    return { mfaRequired: false };
  };  

  const loginWithGoogleFn = async (credential: string) => {
    const { token: tk, usuario } = await api.loginWithGoogle(credential);
    setToken(tk);
    localStorage.setItem("token", tk);
    setUser(usuario);
  };  

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, login, loginWithGoogle: loginWithGoogleFn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
};
