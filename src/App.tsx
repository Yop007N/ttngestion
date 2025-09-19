import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/login/Login";
import Dashboard from "./components/dashboard/Dashboard";
import Gateways from "./components/gateway/Gateway";
import Devices from "./components/devices/Devices";
import Applications from "./components/aplicacion/Applications";
import MQTTConfig from "./components/mqttConfig/MQTTConfig";

import Diseño from "./components/layout/Layout";
import DT723 from "./components/dt723/DT-723";
import { AuthProvider, useAuth } from "./contexts";

function AppContent() {
  const { token, login, logout, isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={login} />
            )
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Diseño onCerrarSesion={logout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="gateways" element={<Gateways />} />
          <Route path="devices" element={<Devices />} />
          <Route path="applications" element={<Applications />} />
          <Route path="mqtt" element={<MQTTConfig />} />
          <Route path="dt723" element={<DT723 />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
