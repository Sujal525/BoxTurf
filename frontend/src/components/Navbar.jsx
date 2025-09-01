import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth0();
  const [role, setRole] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/api/users/${encodeURIComponent(user.email)}`
          );
          setRole(res.data.role);
        } catch (err) {
          console.error("❌ Error fetching role:", err);
        }
      }
    };
    fetchRole();
  }, [user]);

  const toggleDrawer = (state) => () => setOpen(state);

  // ✅ Nav items strictly by role
  let navItems = [{ label: "Home", path: "/" }];

  if (role === "admin") {
    navItems.push({ label: "Admin Dashboard", path: "/dashboard" });
  }
  if (role === "owner") {
    navItems.push({ label: "Owner Dashboard", path: "/ownerdashboard" });
  }
  if (role === "user") {
    navItems.push({ label: "Dashboard", path: "/dashboard" });
    navItems.push({ label: "Cart", path: "/cart" });
    navItems.push({ label: "My Bookings", path: "/mybookings" });
  }

  // 🔹 Always show Dashboard on Landing Page (redirects user-specific)
  if (location.pathname === "/" ) {
    navItems.push({ label: "Dashboard", path: "/userdashboard" });
  }

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "#1e3c72",
          transition: "all 0.3s ease-in-out",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <Toolbar>
          {/* Logo */}
          <SportsSoccerIcon sx={{ mr: 1, fontSize: 30, color: "white" }} />
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              cursor: "pointer",
              color: "white",
            }}
            onClick={() => navigate("/")}
          >
            BookNJoy
          </Typography>

          {/* Desktop Nav */}
          <div className="desktop-only">
            {navItems.map((item, idx) => (
              <Button
                key={idx}
                onClick={() => navigate(item.path)}
                sx={{
                  color: "white",
                  mx: 1.5,
                  fontWeight: "600",
                  position: "relative",
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    width: "0%",
                    height: "2px",
                    bottom: 0,
                    left: 0,
                    bgcolor: "#f77f00",
                    transition: "width 0.3s ease-in-out",
                  },
                  "&:hover:after": {
                    width: "100%",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}

            {isAuthenticated && (
              <Button
                onClick={() => logout({ returnTo: window.location.origin })}
                sx={{
                  ml: 2,
                  color: "white",
                  fontWeight: "600",
                  border: "1px solid white",
                  borderRadius: "8px",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
                }}
              >
                Logout
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="mobile-only">
            <IconButton color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            bgcolor: "#1e3c72",
            color: "white",
            height: "100%",
            p: 2,
          }}
        >
          <IconButton
            sx={{ color: "white", mb: 2 }}
            onClick={toggleDrawer(false)}
          >
            <CloseIcon />
          </IconButton>
          <List>
            {navItems.map((item, idx) => (
              <ListItem
                button
                key={idx}
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                }}
                sx={{
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: "600" }}
                />
              </ListItem>
            ))}

            {isAuthenticated && (
              <ListItem
                button
                onClick={() => {
                  logout({ returnTo: window.location.origin });
                  setOpen(false);
                }}
                sx={{
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  mt: 2,
                }}
              >
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{ fontWeight: "600" }}
                />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;


