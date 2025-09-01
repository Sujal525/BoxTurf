import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Modal,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth0();
  const [turfs, setTurfs] = useState([]);
  const [selectedTurf, setSelectedTurf] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/turfs`);
        setTurfs(res.data);
      } catch (err) {
        console.error("❌ Error fetching turfs:", err);
      }
    };
    fetchTurfs();
  }, []);

  return (
    <Container sx={{ py: 6 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={2}
        color="primary"
        sx={{ textAlign: "center" }}
      >
        Welcome {user?.name || "Guest"} to BookNJoy 👋
      </Typography>

      <Grid container spacing={3}>
        {turfs.map((turf) => (
          <Grid item xs={12} md={4} key={turf._id}>
            <Card
              onClick={() => setSelectedTurf(turf)}
              sx={{
                cursor: "pointer",
                borderRadius: "16px",
                transition: "0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={turf.image}
                alt={turf.name}
                sx={{ borderRadius: "16px 16px 0 0" }}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {turf.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {turf.location.city}, {turf.location.state}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Turf Modal */}
      <Modal open={!!selectedTurf} onClose={() => setSelectedTurf(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "70%",
            maxWidth: 700,
            bgcolor: "white",
            borderRadius: "16px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <IconButton
            onClick={() => setSelectedTurf(null)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          {selectedTurf && (
            <>
              <Typography variant="h5" fontWeight="bold" mb={2}>
                {selectedTurf.name}
              </Typography>
              <Typography>
                📍 {selectedTurf.location.address}, {selectedTurf.location.city}
              </Typography>
              <Typography>⚽ Sports: {selectedTurf.sportsCategory}</Typography>
              <Typography sx={{ mt: 1 }}>
                👥 Customer Price:
                <br />
                Morning ₹{selectedTurf.customerPrice.morning} | Afternoon ₹
                {selectedTurf.customerPrice.afternoon} | Evening ₹
                {selectedTurf.customerPrice.evening} | Night ₹
                {selectedTurf.customerPrice.night}
              </Typography>

              {isAuthenticated ? (
  <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
    <Button
  variant="contained"
  sx={{ background: "linear-gradient(90deg,#1e3c72,#2a5298)", borderRadius: "12px", px: 3 }}
  onClick={() => {
    setSelectedTurf(null);
    navigate(`/userpayment/${selectedTurf._id}`); // ✅ Direct booking
  }}
>
  🚀 Book Now
</Button>
<Button
  variant="outlined"
  sx={{ borderRadius: "12px", px: 3 }}
  onClick={() => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    // Prevent duplicates
    if (!cart.find((item) => item._id === selectedTurf._id)) {
      cart.push(selectedTurf);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("✅ Turf added to cart");
    } else {
      alert("⚠ Already in cart");
    }
    setSelectedTurf(null);
    navigate("/cart"); // ✅ Redirect to cart page
  }}
>
  🛒 Add to Cart
</Button>

  </Box>
) : (
  <Typography color="error" mt={2}>
    ⚠ Please login to book this turf
  </Typography>
)}

            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default UserDashboard;
