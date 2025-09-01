import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { API_BASE_URL } from "./utils/api";

import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import UserPayment from "./pages/UserPayment";
import MyBookings from "./pages/MyBookings";
import UserCart from "./pages/UserCart";
import OwnerDashboard from "./pages/OwnerDashboard";  // ✅ import

function App() {
  const { isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(null);

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

          if (location.pathname === "/") {
            navigate("/dashboard");
          }
        } catch (err) {
          console.error("❌ Error saving user:", err);
        }
      }
    };

    saveUser();
  }, [isAuthenticated, user, navigate, location.pathname]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ✅ User Side */}
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/userpayment/:id" element={<UserPayment />} />
        <Route
          path="/mybookings"
          element={role === "user" ? <MyBookings /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/cart"
          element={role === "user" ? <UserCart /> : <Navigate to="/dashboard" />}
        />

        {/* ✅ Owner Side */}
        <Route
          path="/ownerdashboard"
          element={role === "owner" ? <OwnerDashboard /> : <Navigate to="/dashboard" />}
        />
      </Routes>
    </>
  );
}

export default App;
