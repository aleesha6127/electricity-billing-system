import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Configuration from "./pages/Configuration";
import Testing from "./pages/Testing";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<AdminLogin />} />

        {/* PROTECTED ADMIN ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />



        <Route
          path="/config"
          element={
            <ProtectedRoute>
              <Configuration />
            </ProtectedRoute>
          }
        />

        <Route
          path="/testing"
          element={
            <ProtectedRoute>
              <Testing />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
