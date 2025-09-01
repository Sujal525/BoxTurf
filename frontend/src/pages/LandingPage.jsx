import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Grid,
  Card,
  Avatar,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import SportsFootballIcon from "@mui/icons-material/SportsFootball";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";

const LandingPage = () => {
  const [role, setRole] = useState("user");
  const { loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  
  const handleLogin = async () => {
    // ✅ Store selected role so App.jsx can use it
    sessionStorage.setItem("selectedRole", role);

    await loginWithRedirect({
      appState: { returnTo: "/dashboard" },
    });
  };

  // Scroll fade-up animation
  useEffect(() => {
    const handleScroll = () => {
      document.querySelectorAll(".fade-up").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
          el.classList.add("visible");
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage:
            "url('https://media.istockphoto.com/id/1290874200/photo/green-grass-texture-top-view-sport-background-soccer-football-rugby-golf-baseball.jpg?s=612x612&w=0&k=20&c=Ji7WWTGoAh7abksPlKcdC5_hNJglAxIRuX8TOjx5hVM=')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          px: 2,
        }}
      >
        <Container>
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              mb: 2,
              textShadow: "0 3px 15px rgba(0,0,0,0.9)", // stronger shadow for readability
              color: "#fff",
              animation: "fadeInDown 1s ease-out",
            }}
          >
            Your Game, Your Turf
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              maxWidth: "700px",
              mx: "auto",
              color: "#f8f9fa",
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
              animation: "fadeInUp 1.2s ease-out",
            }}
          >
            Discover, book, and play at premium turfs near you. Football, cricket,
            tennis, badminton & more — <b>BookNJoy</b> has it all.
          </Typography>

          {/* Role Selector */}
          <Paper
            elevation={8}
            sx={{
              display: "inline-block",
              p: 3,
              borderRadius: "16px",
              mb: 3,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
              border: "2px solid rgba(255,255,255,0.3)",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", mb: 2, color: "#fff" }}
            >
              Select Your Role
            </Typography>
            <ToggleButtonGroup
              value={role}
              exclusive
              onChange={(e, newRole) => setRole(newRole || "user")}
              aria-label="role selection"
            >
              {["user", "owner", "admin"].map((r) => (
                <ToggleButton
                  key={r}
                  value={r}
                  sx={{
                    px: 3,
                    textTransform: "capitalize",
                    color: "#fff",
                    "&.Mui-selected": {
                      background: "linear-gradient(90deg,#2a5298,#1e3c72)",
                      color: "#fff",
                      border: "none",
                    },
                  }}
                >
                  {r}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Paper>

          <Box>
            <Button
              variant="contained"
              size="large"
              onClick={handleLogin}
              sx={{
                background: "linear-gradient(90deg,#ff512f,#f09819)",
                fontWeight: "bold",
                px: 6,
                py: 1.6,
                borderRadius: "14px",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "scale(1.07)",
                  boxShadow: "0 0 25px rgba(255,81,47,0.7)",
                },
              }}
            >
              Continue with Google
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Glowing Divider */}
      <Box sx={{ height: "5px", background: "linear-gradient(90deg,#ff512f,#2a5298,#1e3c72)" }} />

      {/* Unified Section with 3 Rows (Light Theme) */}
      <Box sx={{ py: 12, bgcolor: "#fff" }}>
        <Container>
          {/* Row 1 - How It Works */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              mb: 6,
              color: "#1e293b",
            }}
          >
            How It Works
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[
              { step: "1", title: "Find a Turf", desc: "Search by location, sport & availability." },
              { step: "2", title: "Book Instantly", desc: "Reserve your slot in real-time." },
              { step: "3", title: "Play & Enjoy", desc: "Show up, play hard, and have fun!" },
            ].map((item, i) => (
              <Grid item xs={12} md={4} key={i} className="fade-up">
                <Card
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: "16px",
                    border: "2px solid transparent",
                    background: "#f9fafb",
                    color: "#1e293b",
                    transition: "0.3s",
                    "&:hover": {
                      borderColor: "#2a5298",
                      transform: "translateY(-8px)",
                      boxShadow: "0 0 20px rgba(42,82,152,0.4)",
                    },
                  }}
                >
                  <Typography variant="h3" sx={{ color: "#ff512f", mb: 2 }}>
                    {item.step}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography color="text.secondary">{item.desc}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Divider */}
          <Box sx={{ height: "3px", my: 10, background: "linear-gradient(90deg,#2a5298,#1e3c72,#ff512f)" }} />

          {/* Row 2 - Why Choose Us */}
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", textAlign: "center", mb: 6, color: "#1e293b" }}
          >
            Why Choose BookNJoy?
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[
              { icon: <SportsSoccerIcon sx={{ fontSize: 55, color: "#2a5298" }} />, title: "Instant Booking", desc: "Check real-time availability & confirm instantly." },
              { icon: <SportsTennisIcon sx={{ fontSize: 55, color: "#1e3c72" }} />, title: "All Sports", desc: "Football, cricket, tennis, badminton & more." },
              { icon: <SportsCricketIcon sx={{ fontSize: 55, color: "#00a86b" }} />, title: "Trusted Venues", desc: "Partnered with the best turfs in your city." },
            ].map((f, i) => (
              <Grid item xs={12} md={4} key={i} className="fade-up">
                <Card
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: "16px",
                    border: "2px solid transparent",
                    background: "#f9fafb",
                    color: "#1e293b",
                    transition: "0.3s",
                    "&:hover": {
                      borderColor: f.icon.props.sx.color,
                      transform: "translateY(-8px)",
                      boxShadow: `0 0 25px ${f.icon.props.sx.color}60`,
                    },
                  }}
                >
                  {f.icon}
                  <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2, mb: 1 }}>
                    {f.title}
                  </Typography>
                  <Typography color="text.secondary">{f.desc}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Divider */}
          <Box sx={{ height: "3px", my: 10, background: "linear-gradient(90deg,#2a5298,#1e3c72,#ff512f)" }} />

          {/* Row 3 - Testimonials */}
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", textAlign: "center", mb: 6, color: "#1e293b" }}
          >
            Loved by Players
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[
              { name: "Rahul", text: "Booking was super easy & smooth!", img: "https://i.pravatar.cc/100?img=8" },
              { name: "Rohit", text: "Secure payments & instant slots!", img: "https://i.pravatar.cc/100?img=12" },
              { name: "Virat", text: "Finally, one platform for all my sports!", img: "https://i.pravatar.cc/100?img=65" },
            ].map((r, i) => (
              <Grid item xs={12} md={4} key={i} className="fade-up">
                <Card
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: "16px",
                    border: "2px solid transparent",
                    background: "#f9fafb",
                    color: "#1e293b",
                    transition: "0.3s",
                    "&:hover": {
                      borderColor: "#2a5298",
                      transform: "translateY(-8px)",
                      boxShadow: "0 0 20px rgba(42,82,152,0.4)",
                    },
                  }}
                >
                  <Avatar src={r.img} sx={{ width: 70, height: 70, mx: "auto", mb: 2 }} />
                  <Typography variant="body1" sx={{ fontStyle: "italic", mb: 1 }}>
                    “{r.text}”
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#2a5298" }}>
                    - {r.name}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box
        sx={{
          py: 10,
          textAlign: "center",
          background: "linear-gradient(90deg,#2a5298,#1e3c72)",
          color: "white",
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Ready to Play?
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Book your turf today & join thousands already using BookNJoy.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleLogin}
          sx={{
            background: "linear-gradient(90deg,#ff512f,#f09819)",
            px: 6,
            py: 1.6,
            fontWeight: "bold",
            borderRadius: "12px",
            transition: "0.3s",
            "&:hover": { transform: "scale(1.05)" },
          }}
        >
          Get Started
        </Button>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "#f1f5f9", color: "#1e293b", py: 4, textAlign: "center" }}>
        <Typography variant="h6">© {new Date().getFullYear()} BookNJoy</Typography>
      </Box>

      {/* Animations */}
      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { opacity: 0; transform: translateY(30px); transition: all 0.6s ease; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
      `}</style>
    </>
  );
};

export default LandingPage;
