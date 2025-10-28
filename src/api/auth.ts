import type { User } from "../types/types";

const API = "http://localhost:5000/api";

// Registro
export const register = async (data: {
  nombre: string;
  email: string;
  password: string;
}) => {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Error en registro");
  }
  return res.json(); // seguramente { msg: "Revisa tu correo para confirmar" }
};

// Confirmación de cuenta
export const confirmAccount = async (token: string) => {
  const res = await fetch(`${API}/confirm-account`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) throw new Error("Error en confirmación");
  return res.json();
};

export type LoginResult =
  | { mfaRequired: true; method: "TOTP" | "EMAIL" | "SMS"; challengeId: string }
  | { msg: string; token: string; usuario: User };

export const login = async (data: {
  email: string;
  password: string;
}): Promise<LoginResult> => {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error en login");
  return res.json();
};


// Usuario logueado
export const getUser = async (token: string): Promise<User> => {
  const res = await fetch(`${API}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("No autorizado");
  return res.json();
};

export const loginWithGoogle = async (credential: string) => {
    const res = await fetch(`${API}/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });
    if (!res.ok) throw new Error("Error en login con Google");
    return res.json(); // { msg, token, usuario }
  };
  
  export const updateProfile = async (
    token: string,
    data: { nombre?: string; phone?: string }
  ) => {
    const res = await fetch(`${API}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error actualizando perfil");
    return res.json();
  };
  