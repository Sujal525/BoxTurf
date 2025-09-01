import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import turfRoutes from "./routes/turfRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js"; // ✅ add this

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/turfs", turfRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes); // ✅ mount booking routes

// DB + Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
