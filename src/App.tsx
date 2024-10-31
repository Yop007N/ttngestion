import React, { useState } from "react";
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

export default function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("ttnToken")
  );
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("ttnUserId")
  );

  const handleLogin = (newToken: string, newUserId: string) => {
    setToken(newToken);
    setUserId(newUserId);
    localStorage.setItem("ttnToken", newToken);
    localStorage.setItem("ttnUserId", newUserId);
  };

  const handleLogout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("ttnToken");
    localStorage.removeItem("ttnUserId");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/"
          element={
            token ? (
              <Diseño onCerrarSesion={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="gateways" element={<Gateways />} />
          <Route path="devices" element={<Devices />} />
          <Route path="applications" element={<Applications />} />
          <Route path="mqtt" element={<MQTTConfig token={token || ""} />} />
          <Route path="dt723" element={<DT723 token={token || ""} />} />
        </Route>
      </Routes>
    </Router>
  );
}
