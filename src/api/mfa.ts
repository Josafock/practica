const API = "https://backend-modulo-autenticacion-practica.onrender.com/api";

export const startMfaSetup = async (method: "TOTP" | "EMAIL" | "SMS", token: string) => {
  const res = await fetch(`${API}/mfa/setup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ method }),
  });

  const data = await res.json();
  console.log("MFA Setup response:", data); // 👈 agrega esto

  if (!res.ok) throw new Error(data.error || "Error iniciando setup MFA");
  return data;
};

export const verifyMfaSetup = async (code: string, token: string) => {
  const res = await fetch(`${API}/mfa/setup/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) throw new Error("Error verificando MFA");
  return res.json();
};

export const verifyMfaLogin = async (challengeId: string, code: string) => {
  const res = await fetch(`${API}/mfa/login/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challengeId, code }),
  });
  if (!res.ok) throw new Error("Error verificando login MFA");
  return res.json();
};

export const resendMfaOtp = async (challengeId: string) => {
  const res = await fetch(`${API}/mfa/login/resend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challengeId }),
  });
  if (!res.ok) throw new Error("Error reenviando OTP");
  return res.json();
};

export const disableMfa = async (token: string) => {
  const res = await fetch(`${API}/mfa/disable`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error deshabilitando MFA");
  return res.json();
};
