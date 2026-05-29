import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Patients from "./pages/Patients/Patients";
import PatientDetail from "./pages/PatientDetail/PatientDetail";
import Appointments from "./pages/Appointments/Appointments";
import PriceList from "./pages/PriceList/PriceList";
import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound/NotFound";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true",
  );

  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout onLogout={handleLogout} />}>
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="price-list" element={<PriceList />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
