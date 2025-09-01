import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import OwnerDashboard from "./OwnerDashboard";

const Dashboard = () => {
  const { user } = useAuth0();
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/api/users/${encodeURIComponent(user.email)}`
          );
          const fetchedRole = res.data.role;

          // ✅ Restrict admin to one fixed email
          if (fetchedRole === "admin" && user.email !== "sujaldhruve@gmail.com") {
            setError("Invalid email for admin login.");
            setRole(null);
            return;
          }

          setRole(fetchedRole);
        } catch (err) {
          console.error("❌ Error fetching user role:", err);
          setError("Error fetching role");
        }
      }
    };
    fetchRole();
  }, [user]);

  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
          color: "red",
          fontWeight: "bold",
        }}
      >
        {error}
      </div>
    );
  }

  if (!role) return <div>Loading...</div>;

  if (role === "admin") return <AdminDashboard />;
  if (role === "owner") return <OwnerDashboard />;
  if (role === "user") return <UserDashboard />;

  return <div>No valid role found</div>;
};

export default Dashboard;
