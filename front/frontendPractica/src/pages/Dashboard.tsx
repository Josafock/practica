import { useState } from "react";
import { startMfaSetup, verifyMfaSetup } from "../api/mfa";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function MfaSetup() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [method, setMethod] = useState<"TOTP" | "EMAIL" | "SMS" | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSetup = async (m: "TOTP" | "EMAIL" | "SMS") => {
    if (!token) return;

    // ✅ Si es SMS y no hay teléfono, redirigir a /profile
    if (m === "SMS" && (!user?.phone || user.phone.trim() === "")) {
      toast.info("Necesitas registrar tu número de teléfono antes de activar MFA por SMS.");
      navigate("/profile");
      return;
    }

    setMethod(m);
    setIsLoading(true);
    try {
      const res = await startMfaSetup(m, token);
      if (m === "TOTP") {
        setQr(res.qr); // muestra QR para escanear
      } else {
        toast.success(res.msg || (m === "EMAIL" ? "OTP enviado al correo" : "OTP enviado por SMS"));
      }
    } catch {
      toast.error("No se pudo iniciar la configuración de MFA");
      setMethod(null);
      setQr(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!token) return;
    if (!code.trim()) {
      toast.error("Ingresa el código");
      return;
    }
    setIsLoading(true);
    try {
      const res = await verifyMfaSetup(code.trim(), token);
      toast.success(res.msg || "MFA habilitado ✅");
      // opcional: reset de estado
      setMethod(null);
      setQr(null);
      setCode("");
    } catch {
      toast.error("Código inválido o expirado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
        <h2 className="text-2xl font-bold text-white mb-4">Configurar MFA</h2>

        {!method && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleSetup("TOTP")}
              disabled={isLoading}
              className="px-4 py-3 bg-blue-500/90 hover:bg-blue-500 text-white rounded-2xl transition-all"
            >
              TOTP
            </button>
            <button
              onClick={() => handleSetup("EMAIL")}
              disabled={isLoading}
              className="px-4 py-3 bg-green-500/90 hover:bg-green-500 text-white rounded-2xl transition-all"
            >
              Email
            </button>
            <button
              onClick={() => handleSetup("SMS")}
              disabled={isLoading}
              className="px-4 py-3 bg-purple-500/90 hover:bg-purple-500 text-white rounded-2xl transition-all"
            >
              SMS
            </button>
          </div>
        )}

        {method === "TOTP" && qr && (
          <div className="mt-6">
            <p className="text-purple-100 mb-3">Escanea este QR en Google Authenticator y escribe el código:</p>
            <img src={qr} alt="QR MFA" className="rounded-xl border border-white/20" />
            <div className="mt-4 flex gap-2">
              <input
                className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-purple-200 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all"
                placeholder="Ingresa el código"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button
                onClick={handleVerify}
                disabled={isLoading}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all"
              >
                {isLoading ? "Verificando..." : "Verificar"}
              </button>
            </div>
          </div>
        )}

        {(method === "EMAIL" || method === "SMS") && (
          <div className="mt-6">
            <p className="text-purple-100 mb-3">
              Ingresa el código enviado por {method === "EMAIL" ? "correo" : "SMS"}:
            </p>
            <div className="flex gap-2">
              <input
                className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-purple-200 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all"
                placeholder="Ingresa el código"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button
                onClick={handleVerify}
                disabled={isLoading}
                className="px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-2xl transition-all"
              >
                {isLoading ? "Verificando..." : "Verificar"}
              </button>
            </div>
            {method === "SMS" && (!user?.phone || user.phone.trim() === "") && (
              <p className="text-pink-200 text-sm mt-2">
                No tienes teléfono registrado. <span
                  onClick={() => navigate("/profile")}
                  className="underline cursor-pointer hover:text-white"
                >Ir a perfil</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
