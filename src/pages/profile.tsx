import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { updateProfile } from "../api/auth"; // crea esta función en api/auth
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, token, setUser } = useAuth();
  const [nombre, setNombre] = useState(user?.nombre || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
        setIsLoading(true);
        const res = await updateProfile(token, { nombre, phone });
        setUser(res.usuario || { ...user!, nombre, phone }); // sobrescribes el user en memoria
        toast.success("Perfil actualizado correctamente");
        navigate("/dashboard");
    } catch {
      toast.error("No se pudo actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-10">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Mi Perfil</h2>
            <p className="text-purple-100 text-lg">Actualiza tu información</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Nombre
              </label>
              <input
                type="text"
                placeholder="Tu nombre"
                className="block w-full px-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-purple-200 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-200"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Teléfono
              </label>
              <input
                type="text"
                placeholder="+52 123 456 7890"
                className="block w-full px-4 py-3 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-purple-200 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-200"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="text-sm text-purple-200 mt-1">
                Necesario para activar MFA por SMS
              </p>
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-6 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
