import { useState } from "react";
import { confirmAccount } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ConfirmAccount() {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await confirmAccount(token);
      toast.success(res.msg || "¡Cuenta confirmada correctamente!");
      navigate("/login");
    } catch (err) {
      toast.error("Token inválido o error en la confirmación. Verifica el código e intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Card del formulario */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-12">
          
          {/* Header del formulario */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl border border-white/20">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Confirmar Cuenta</h2>
            <p className="text-purple-100 text-lg">
              Ingresa el código de confirmación que recibiste en tu email
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Token */}
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-white mb-3">
                Código de confirmación
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <input
                  id="token"
                  type="text"
                  placeholder="Ej: ABC123XYZ"
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-purple-200 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-200 backdrop-blur-sm text-center tracking-widest font-mono"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-purple-300 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-purple-100 text-sm">
                  Revisa tu bandeja de entrada y busca el email con el código de verificación. 
                  Si no lo encuentras, revisa la carpeta de spam.
                </p>
              </div>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-200 focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Confirmando...
                </div>
              ) : (
                "Confirmar Cuenta"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-purple-200 text-sm">
              ¿Problemas con el código?{" "}
              <a 
                href="#" 
                className="text-white font-semibold hover:text-pink-300 transition-colors duration-200"
              >
                Reenviar código
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}