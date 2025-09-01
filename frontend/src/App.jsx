import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { API_BASE_URL } from "./utils/api";

import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard"; // Admin Dashboard
import UserDashboard from "./pages/UserDashboard";
import UserPayment from "./pages/UserPayment";
import MyBookings from "./pages/MyBookings";
import UserCart from "./pages/UserCart";
import OwnerDashboard from "./pages/OwnerDashboard";

function App() {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const saveUser = async () => {
      if (isAuthenticated && user) {
        try {
          const storedRole = sessionStorage.getItem("selectedRole") || "user";

          await axios.post(`${API_BASE_URL}/api/users/login`, {
            name: user.name,
            email: user.email,
            picture: user.picture,
            auth0Id: user.sub,
            role: storedRole,
          });

          setRole(storedRole);
        } catch (err) {
          console.error("❌ Error saving user:", err);
        } finally {
          setLoadingRole(false);
        }
      } else {
        setLoadingRole(false);
      }
    };

    saveUser();
  }, [isAuthenticated, user]);

  if (isLoading || loadingRole) {
    return <div>Loading...</div>; // spinner if you want
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* ✅ Admin Side */}
        <Route path="/dashboard" element={role === "admin" ? <Dashboard /> : <Navigate to="/" />} />

        {/* ✅ User Side */}
        <Route path="/userdashboard" element={role === "user" ? <UserDashboard /> : <Navigate to="/" />} />
        <Route path="/userpayment/:id" element={role === "user" ? <UserPayment /> : <Navigate to="/" />} />
        <Route path="/mybookings" element={role === "user" ? <MyBookings /> : <Navigate to="/" />} />
        <Route path="/cart" element={role === "user" ? <UserCart /> : <Navigate to="/" />} />

        {/* ✅ Owner Side */}
        <Route path="/ownerdashboard" element={role === "owner" ? <OwnerDashboard /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
