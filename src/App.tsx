import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ConfirmAccount from "./pages/ConfirmAccount";
import Dashboard from "./pages/Dashboard";
import MfaLogin from "./pages/mfaLogin";
import Profile from "./pages/profile";
import { Toaster } from "sonner";

function App() {
  return (
    <>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/confirm-account" element={<ConfirmAccount />} />
          <Route path="/mfa-login" element={<MfaLogin />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    <Toaster richColors position="top-right" />
    </>
  );
}

export default App;
