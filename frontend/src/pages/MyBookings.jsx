import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";

const MyBookings = () => {
  const { user } = useAuth0();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/bookings/${user.email}`);
        setBookings(res.data);
      } catch (err) {
        console.error("❌ Error fetching bookings:", err);
        setError("Failed to fetch your bookings");
      } finally {
        setLoading(false);
      }
    };
    if (user?.email) fetchBookings();
  }, [user]);

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight="bold" mb={3} color="primary">
        📒 My Bookings
      </Typography>

      {bookings.length === 0 ? (
        <Alert severity="info">You have no bookings yet.</Alert>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} md={6} key={booking._id}>
              <Card
                elevation={6}
                sx={{
                  borderRadius: "16px",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-6px)", boxShadow: "0 6px 20px rgba(0,0,0,0.2)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {booking.turfId?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📍 {booking.turfId?.location.city}, {booking.turfId?.location.state}
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    🗓 Date: {new Date(booking.bookingDate).toDateString()}
                  </Typography>
                  <Typography>⏰ Slot: {booking.slot}</Typography>
                  <Typography>💰 Amount Paid: ₹{booking.price - (booking.discountApplied || 0)}</Typography>
                  <Typography>Status: <b>{booking.status}</b></Typography>
                  {booking.promoCode && <Typography>🎟 Promo Applied: {booking.promoCode}</Typography>}
                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    href={`mailto:${user.email}`}
                  >
                    📧 Resend Receipt
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyBookings;
