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

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/api/users/${encodeURIComponent(user.email)}`
          );
          setRole(res.data.role);
        } catch (err) {
          console.error("❌ Error fetching user role:", err);
        }
      }
    };
    fetchRole();
  }, [user]);

  if (!role) return <div>Loading...</div>;

  if (role === "admin") return <AdminDashboard />;
if (role === "owner") return <div><OwnerDashboard/></div>;
if (role === "user") return <UserDashboard />;
};

export default Dashboard;
