import { useState, useEffect } from "react";
import { verifyMfaLogin, resendMfaOtp } from "../api/mfa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { toast } from "sonner";

export default function MfaLogin() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [params] = useSearchParams();
  const challengeId = params.get("challengeId")!;
  const method = params.get("method") as "TOTP" | "EMAIL" | "SMS";

  // 👉 Validar si falta teléfono y el método es SMS
  useEffect(() => {
    if (method === "SMS" && (!user?.phone || user.phone.trim() === "")) {
      toast.info("Debes registrar tu número de teléfono antes de usar MFA por SMS");
      navigate("/profile");
    }
  }, [method, user, navigate]);

  const handleVerify = async () => {
    try {
      const res = await verifyMfaLogin(challengeId, code);
      localStorage.setItem("token", res.token);
      // ⚡ Aquí deberías actualizar el user en el AuthContext
      navigate("/dashboard");
    } catch {
      toast.error("Código inválido");
    }
  };

  const handleResend = async () => {
    try {
      await resendMfaOtp(challengeId);
      toast.success("Nuevo código enviado");
    } catch {
      toast.error("No se pudo reenviar el código");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">
          MFA requerido ({method})
        </h2>

        <input
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-purple-200 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-200 mb-4"
          placeholder="Ingresa el código"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={handleVerify}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-200"
          >
            Verificar
          </button>

          {method !== "TOTP" && (
            <button
              onClick={handleResend}
              className="flex-1 bg-gray-600 text-white py-3 rounded-2xl font-semibold hover:bg-gray-500 transition-all duration-200"
            >
              Reenviar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
