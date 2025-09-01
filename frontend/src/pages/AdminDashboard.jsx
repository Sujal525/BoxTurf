// AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Modal,
  IconButton,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";
import { useAuth0 } from "@auth0/auth0-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const { user } = useAuth0();
  const [tab, setTab] = useState(0);
  const [turfs, setTurfs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [form, setForm] = useState({
  name: "",
  location: { state: "", city: "", area: "", address: "", pincode: "", coordinates: { lat: "", lng: "" } },
  image: "",
  sportsCategory: "",
  size: "",
  price: { morning: "", afternoon: "", evening: "", night: "" },
  customerPrice: { morning: "", afternoon: "", evening: "", night: "" },
  ownerEmail: "",   // ✅ NEW
});


  // Fetch turfs
  const fetchTurfs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/turfs`);
      setTurfs(res.data);
    } catch (err) {
      console.error("❌ Error fetching turfs:", err);
    }
  };

  // Fetch bookings (for analytics)
  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/bookings/all`);
      setBookings(res.data);
    } catch (err) {
      console.error("❌ Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    fetchTurfs();
    fetchBookings();
  }, []);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Turf name is required.";
    if (!form.sportsCategory)
      newErrors.sportsCategory = "Sports category is required.";
    if (!form.location.city) newErrors.city = "City is required.";
    if (
      isNaN(form.location.coordinates.lat) ||
      form.location.coordinates.lat === ""
    )
      newErrors.lat = "Latitude must be a number.";
    if (
      isNaN(form.location.coordinates.lng) ||
      form.location.coordinates.lng === ""
    )
      newErrors.lng = "Longitude must be a number.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleChange = (field, value) => setForm({ ...form, [field]: value });
  const handleLocationChange = (field, value) =>
    setForm({ ...form, location: { ...form.location, [field]: value } });
  const handleCoordinateChange = (field, value) =>
    setForm({
      ...form,
      location: {
        ...form.location,
        coordinates: { ...form.location.coordinates, [field]: value },
      },
    });
  const handlePriceChange = (type, field, value) =>
    setForm({ ...form, [type]: { ...form[type], [field]: value } });

  // Create turf
  const handleCreate = async () => {
    if (!validateForm()) return;
    try {
      await axios.post(`${API_BASE_URL}/api/turfs`, {
  ...form,
  createdBy: user?.email,
});

      setToast({
        open: true,
        message: "✅ Turf added successfully!",
        severity: "success",
      });
      setForm({
        name: "",
        location: {
          state: "",
          city: "",
          area: "",
          address: "",
          pincode: "",
          coordinates: { lat: "", lng: "" },
        },
        image: "",
        sportsCategory: "",
        size: "",
        price: { morning: "", afternoon: "", evening: "", night: "" },
        customerPrice: { morning: "", afternoon: "", evening: "", night: "" },
      });
      fetchTurfs();
    } catch (err) {
      console.error("❌ Error creating turf:", err);
      setToast({
        open: true,
        message: "❌ Failed to add turf!",
        severity: "error",
      });
    }
  };

  // Delete turf
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/turfs/${id}`);
      fetchTurfs();
      setSelectedTurf(null);
      setToast({
        open: true,
        message: "🗑 Turf deleted successfully!",
        severity: "info",
      });
    } catch (err) {
      console.error("❌ Error deleting turf:", err);
      setToast({
        open: true,
        message: "❌ Failed to delete turf!",
        severity: "error",
      });
    }
  };

  // ====== ANALYTICS CALCULATIONS ======
  const totalRevenue = bookings.reduce(
    (sum, b) => sum + (b.price - (b.discountApplied || 0)),
    0
  );
  const totalBookings = bookings.length;
  const avgRevenue =
    totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(2) : 0;

  // ✅ Net Profit Calculation
  const totalProfit = bookings.reduce((sum, b) => {
    const customerPaid = b.price - (b.discountApplied || 0);
    const adminCost = b.turfId?.price?.[b.slot] || 0;
    return sum + (customerPaid - adminCost);
  }, 0);

  // Revenue by date
  const revenueByDate = bookings.reduce((acc, b) => {
    const date = new Date(b.bookingDate).toLocaleDateString();
    acc[date] = (acc[date] || 0) + (b.price - (b.discountApplied || 0));
    return acc;
  }, {});
  const revenueTrend = Object.entries(revenueByDate).map(([date, revenue]) => ({
    date,
    revenue,
  }));

  // Revenue by turf
  const revenueByTurf = bookings.reduce((acc, b) => {
    const turfName = b.turfId?.name || "Unknown Turf";
    acc[turfName] =
      (acc[turfName] || 0) + (b.price - (b.discountApplied || 0));
    return acc;
  }, {});
  const revenueTurfData = Object.entries(revenueByTurf).map(
    ([name, revenue]) => ({ name, revenue })
  );

  return (
    <Container sx={{ py: 6 }}>
      {/* Header */}
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={2}
        sx={{
          background: "linear-gradient(90deg,#1e3c72,#2a5298)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Welcome {user?.name} 👋
      </Typography>
      <Typography variant="body1" mb={4} color="text.secondary">
        Manage turfs with <b>BookNJoy</b>. Ensure accuracy, integrity, and smooth
        operations.
      </Typography>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(e, val) => setTab(val)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 4 }}
      >
        <Tab label="Create Turf" value={0} />
        <Tab label="Read Turfs" value={1} />
        <Tab label="Analytics" value={2} />
      </Tabs>

      {/* === CREATE TURF === */}
      {tab === 0 && (
        <Paper
          elevation={6}
          sx={{
            p: 5,
            borderRadius: "20px",
            mb: 4,
            background: "linear-gradient(135deg,#f9fafc,#eef3ff)",
          }}
        >
          <Typography variant="h6" mb={3} color="#1e3c72" fontWeight="bold">
            🏟 Add New Turf
          </Typography>
          <Grid container spacing={3}>
            {[
  { label: "Turf Name", field: "name", error: errors.name },
  { label: "Sports Category", field: "sportsCategory", error: errors.sportsCategory },
  { label: "State", field: "state" },
  { label: "City", field: "city", error: errors.city },
  { label: "Area", field: "area" },
  { label: "Address", field: "address" },
  { label: "Pincode", field: "pincode" },
  { label: "Latitude", field: "lat", type: "number", error: errors.lat },
  { label: "Longitude", field: "lng", type: "number", error: errors.lng },
  { label: "Turf Size", field: "size" },
  { label: "Image URL", field: "image" },
  { label: "Owner Email", field: "ownerEmail" },  // ✅ NEW FIELD
].map((item, idx) => (
  <Grid item xs={12} md={6} key={idx}>
    <TextField
      fullWidth
      type={item.type || "text"}
      label={item.label}
      value={
        ["lat", "lng"].includes(item.field)
          ? form.location.coordinates[item.field]
          : form[item.field] || form.location[item.field] || ""
      }
      onChange={(e) =>
        ["lat", "lng"].includes(item.field)
          ? handleCoordinateChange(item.field, e.target.value)
          : form.location.hasOwnProperty(item.field)
          ? handleLocationChange(item.field, e.target.value)
          : handleChange(item.field, e.target.value)
      }
      error={!!item.error}
      helperText={item.error}
      variant="filled"
    />
  </Grid>
))}


            {/* Admin Price */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>💰 Admin Base Price (Cost)</Divider>
            </Grid>
            {["morning", "afternoon", "evening", "night"].map((slot, i) => (
              <Grid item xs={6} md={3} key={`admin-${i}`}>
                <TextField
                  fullWidth
                  type="number"
                  label={`${slot} (₹)`}
                  value={form.price[slot]}
                  onChange={(e) => handlePriceChange("price", slot, e.target.value)}
                  variant="filled"
                />
              </Grid>
            ))}

            {/* Customer Price */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>👥 Customer Price (Selling)</Divider>
            </Grid>
            {["morning", "afternoon", "evening", "night"].map((slot, i) => (
              <Grid item xs={6} md={3} key={`cust-${i}`}>
                <TextField
                  fullWidth
                  type="number"
                  label={`${slot} (₹)`}
                  value={form.customerPrice[slot]}
                  onChange={(e) =>
                    handlePriceChange("customerPrice", slot, e.target.value)
                  }
                  variant="filled"
                />
              </Grid>
            ))}

            {/* Submit */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                size="large"
                onClick={handleCreate}
                sx={{
                  mt: 2,
                  background: "linear-gradient(90deg,#1e3c72,#2a5298)",
                  fontWeight: "bold",
                  px: 5,
                  py: 1.4,
                  borderRadius: "12px",
                  transition: "all 0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                Create Turf
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* === READ TURFS === */}
      {tab === 1 && (
        <Grid container spacing={3}>
          {turfs.map((turf) => (
            <Grid item xs={12} md={4} key={turf._id}>
              <Card
                onClick={() => setSelectedTurf(turf)}
                sx={{
                  cursor: "pointer",
                  borderRadius: "16px",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={turf.image}
                  alt={turf.name}
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
      )}

      {/* === ANALYTICS === */}
      {tab === 2 && (
        <Paper
          elevation={6}
          sx={{
            p: 5,
            borderRadius: "20px",
            bgcolor: "white",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{
              background: "linear-gradient(90deg,#1e3c72,#2a5298)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            📊 Turf Revenue Analytics
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 3, borderRadius: "16px", bgcolor: "#e3f2fd" }}>
                <Typography variant="h6">Total Revenue</Typography>
                <Typography variant="h5" fontWeight="bold">
                  ₹{totalRevenue}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 3, borderRadius: "16px", bgcolor: "#fce4ec" }}>
                <Typography variant="h6">Total Bookings</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {totalBookings}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 3, borderRadius: "16px", bgcolor: "#e8f5e9" }}>
                <Typography variant="h6">Avg Revenue / Booking</Typography>
                <Typography variant="h5" fontWeight="bold">
                  ₹{avgRevenue}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 3, borderRadius: "16px", bgcolor: "#fff3e0" }}>
                <Typography variant="h6">Net Profit</Typography>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  ₹{totalProfit}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                📈 Revenue Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#1e3c72" />
                </LineChart>
              </ResponsiveContainer>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                🏟 Revenue by Turf
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueTurfData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#f77f00" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Turf Modal */}
      <Modal open={!!selectedTurf} onClose={() => setSelectedTurf(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "70%",
            maxWidth: 800,
            bgcolor: "white",
            borderRadius: "16px",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
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
              <Box flex={1}>
                <img
                  src={selectedTurf.image}
                  alt={selectedTurf.name}
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    objectFit: "cover",
                    maxHeight: "300px",
                  }}
                />
              </Box>
              <Box flex={2}>
                <Typography variant="h5" fontWeight="bold" mb={2}>
                  {selectedTurf.name}
                </Typography>
                <Typography>
                  <b>Sports:</b> {selectedTurf.sportsCategory}
                </Typography>
                <Typography>
                  <b>Size:</b> {selectedTurf.size}
                </Typography>
                <Typography>
                  <b>State:</b> {selectedTurf.location.state}
                </Typography>
                <Typography>
                  <b>City:</b> {selectedTurf.location.city}
                </Typography>
                <Typography>
                  <b>Area:</b> {selectedTurf.location.area}
                </Typography>
                <Typography>
                  <b>Address:</b> {selectedTurf.location.address}
                </Typography>
                <Typography>
                  <b>Pincode:</b> {selectedTurf.location.pincode}
                </Typography>
                <Typography>
                  <b>Coordinates:</b> {selectedTurf.location.coordinates.lat},{" "}
                  {selectedTurf.location.coordinates.lng}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography>
                  <b>Admin Pricing:</b> Morning ₹{selectedTurf.price.morning}, Afternoon ₹
                  {selectedTurf.price.afternoon}, Evening ₹
                  {selectedTurf.price.evening}, Night ₹
                  {selectedTurf.price.night}
                </Typography>
                <Typography>
                  <b>Customer Pricing:</b> Morning ₹{selectedTurf.customerPrice.morning}, Afternoon ₹
                  {selectedTurf.customerPrice.afternoon}, Evening ₹
                  {selectedTurf.customerPrice.evening}, Night ₹
                  {selectedTurf.customerPrice.night}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(selectedTurf._id)}
                  sx={{ mt: 3 }}
                >
                  Delete Turf
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard;
