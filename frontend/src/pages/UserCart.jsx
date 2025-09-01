import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import {
  Container, Typography, Card, CardContent, Button, IconButton,
  List, ListItem, ListItemText, Divider,
  Box, Grid, Select, MenuItem, Snackbar
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const SLOTS = ["morning", "afternoon", "evening", "night"];

const UserCart = () => {
  const { user } = useAuth0();
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState({ open: false, message: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(saved);
  }, []);

  const handleDelete = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    setToast({ open: true, message: "🗑 Item removed" });
  };

  const handleSlotChange = (index, slot) => {
    const updated = [...cart];
    updated[index].selectedSlot = slot;
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce(
    (sum, item) => sum + (item.customerPrice[item.selectedSlot || "morning"] || 0),
    0
  );

  return (
    <Container sx={{ py: 5 }}>
      <Card sx={{ p: 4, borderRadius: "16px", boxShadow: "0 6px 20px rgba(0,0,0,0.15)" }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>🛒 My Cart</Typography>

          {/* Cart Items */}
          <List>
            {cart.map((item, idx) => (
              <ListItem
                key={idx}
                alignItems="flex-start"
                secondaryAction={
                  <IconButton onClick={() => handleDelete(idx)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "100%", borderRadius: "6px", height: "80px", objectFit: "cover" }}
                    />
                  </Grid>
                  <Grid item xs={9}>
                    <ListItemText
                      primary={<Typography variant="h6">{item.name}</Typography>}
                      secondary={
                        <>
                          <Typography variant="body2">📍 {item.location.city}, {item.location.state}</Typography>
                          <Typography variant="body2">⚽ {item.sportsCategory}</Typography>
                          <Typography variant="body2">
                            💰 Prices → M: ₹{item.customerPrice.morning}, A: ₹{item.customerPrice.afternoon}, 
                            E: ₹{item.customerPrice.evening}, N: ₹{item.customerPrice.night}
                          </Typography>
                        </>
                      }
                    />
                    {/* Slot Select */}
                    <Select
                      value={item.selectedSlot || "morning"}
                      size="small"
                      onChange={(e) => handleSlotChange(idx, e.target.value)}
                      sx={{ mt: 1 }}
                    >
                      {SLOTS.map((s) => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                      ))}
                    </Select>

                    {/* Book Now */}
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ mt: 1, ml: 2 }}
                      onClick={() => navigate(`/userpayment/${item._id}?slot=${item.selectedSlot || "morning"}`)}
                    >
                      Book Now
                    </Button>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          {/* Total */}
          <Typography variant="h6" sx={{ mt: 2 }}>Total: ₹{total}</Typography>
        </CardContent>
      </Card>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
      />
    </Container>
  );
};

export default UserCart;
