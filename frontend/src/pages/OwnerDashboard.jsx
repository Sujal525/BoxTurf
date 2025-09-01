import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Paper } from "@mui/material";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { API_BASE_URL } from "../utils/api";

const OwnerDashboard = () => {
  const { user } = useAuth0();
  const [turfs, setTurfs] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user?.email) {
      axios.get(`${API_BASE_URL}/api/turfs/owner/${user.email}`).then((res) => setTurfs(res.data));
      axios.get(`${API_BASE_URL}/api/bookings/owner/${user.email}`).then((res) => setBookings(res.data));
    }
  }, [user]);

  // Revenue & stats
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.price - (b.discountApplied || 0)), 0);
  const totalBookings = bookings.length;

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" color="primary" mb={3}>
        Owner Dashboard - {user?.email}
      </Typography>

      {/* Turf Details */}
      <Typography variant="h6" mb={2}>🏟 Your Turfs</Typography>
      <Grid container spacing={3}>
        {turfs.map((turf) => (
          <Grid item xs={12} md={4} key={turf._id}>
            <Paper sx={{ p: 3, borderRadius: "16px", textAlign: "center" }}>
              <Typography variant="h6">{turf.name}</Typography>
              <Typography variant="body2">{turf.location.city}, {turf.location.state}</Typography>
              <Typography variant="body2">Sports: {turf.sportsCategory}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Booking Stats */}
      <Typography variant="h6" mt={4} mb={2}>📊 Booking Summary</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: "16px", bgcolor: "#e3f2fd" }}>
            <Typography variant="h6">Total Bookings</Typography>
            <Typography variant="h4">{totalBookings}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: "16px", bgcolor: "#e8f5e9" }}>
            <Typography variant="h6">Total Revenue</Typography>
            <Typography variant="h4">₹{totalRevenue}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OwnerDashboard;
