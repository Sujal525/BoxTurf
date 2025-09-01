import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import {
  Container, Typography, Button, Card, CardContent, CircularProgress,
  Alert, Divider, Box, Snackbar, IconButton, Grid, Chip, Accordion,
  AccordionSummary, AccordionDetails
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const PROMO_CODES = { SAVE10: 10, WELCOME50: 50, FESTIVE20: 20 };

const UserPayment = () => {
  const { user } = useAuth0();
  const { id } = useParams(); // turfId
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const prefilledSlot = queryParams.get("slot");

  const [turf, setTurf] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(prefilledSlot || "");
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [billVisible, setBillVisible] = useState(!!prefilledSlot);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ open: false, message: "" });

  useEffect(() => {
    const fetchTurf = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/turfs/${id}`);
        setTurf(res.data);
      } catch (err) {
        console.error("❌ Error fetching turf:", err);
        setError("Failed to load turf details.");
      }
    };
    fetchTurf();
  }, [id]);

  const applyPromo = (code) => {
    if (PROMO_CODES[code]) {
      setPromoCode(code);
      setDiscount(PROMO_CODES[code]);
      setToast({ open: true, message: `🎉 ${code} applied! Discount ₹${PROMO_CODES[code]}` });
    }
  };

  const handleDemoPayment = async () => {
    if (!selectedSlot) return alert("⚠ Please select a slot first");
    setLoading(true);

    try {
      const amount = turf.customerPrice[selectedSlot];
      await axios.post(`${API_BASE_URL}/api/bookings/demo-payment`, {
        bookingData: {
          turfId: turf._id,
          userEmail: user.email,
          bookingDate: new Date(),
          slot: selectedSlot,
          price: amount,
          promoCode: promoCode || null,
          discountApplied: discount,
        },
      });

      alert("✅ Payment Successful & Booking Confirmed! Check your email.");
    } catch (err) {
      console.error("❌ Payment error:", err);
      alert("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!turf) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }} />;

  return (
    <Container sx={{ py: 5 }}>
      <Grid container spacing={4}>
        {/* Turf Details + Slot */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 4, borderRadius: "16px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>💳 Payment for {turf.name}</Typography>
              <Typography variant="body1">📍 {turf.location.city}</Typography>
              <Divider sx={{ my: 2 }} />

              {/* Slots */}
              <Typography variant="h6">⏰ Select Slot</Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {["morning", "afternoon", "evening", "night"].map(slot => (
                  <Button
                    key={slot}
                    variant={selectedSlot === slot ? "contained" : "outlined"}
                    onClick={() => { setSelectedSlot(slot); setBillVisible(true); }}
                  >
                    {slot} – ₹{turf.customerPrice[slot]}
                  </Button>
                ))}
              </Box>

              {/* Bill Summary */}
              {billVisible && selectedSlot && (
                <Card sx={{ mt: 3, p: 2, bgcolor: "#f1f8e9", borderRadius: "12px" }}>
                  <Typography variant="h6">🧾 Bill Summary</Typography>
                  <Typography>Slot: {selectedSlot}</Typography>
                  <Typography>Base Price: ₹{turf.customerPrice[selectedSlot]}</Typography>
                  <Typography>Discount: ₹{discount}</Typography>
                  <Typography fontWeight="bold">
                    Final Amount: ₹{turf.customerPrice[selectedSlot] - discount}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={handleDemoPayment}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Confirm & Pay"}
                  </Button>
                </Card>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Promo Codes + FAQs */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3 }}>
            <CardContent>
              <Typography variant="h6">🎟 Available Promo Codes</Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                {Object.keys(PROMO_CODES).map(code => (
                  <Chip
                    key={code}
                    label={`${code} - ₹${PROMO_CODES[code]}`}
                    color={promoCode === code ? "success" : "primary"}
                    variant={promoCode === code ? "filled" : "outlined"}
                    onClick={() => applyPromo(code)}
                  />
                ))}
              </Box>

              {/* FAQs */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">❓ FAQs</Typography>
              <Accordion sx={{ mt: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>How do I get my receipt?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  A receipt is instantly sent to your registered email after successful booking.
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Can I cancel my booking?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  Currently, cancellation is not available in demo mode but will be provided in production.
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Can I apply multiple promo codes?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  Only one promo code can be applied at a time.
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        action={
          <IconButton size="small" onClick={() => setToast({ ...toast, open: false })}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default UserPayment;
