import express from "express";
import Booking from "../models/Booking.js";
import nodemailer from "nodemailer";

const router = express.Router();

/**
 * Demo Payment (fake success)
 */
router.post("/demo-payment", async (req, res) => {
  try {
    const { bookingData } = req.body;

    if (!bookingData || !bookingData.userEmail || !bookingData.turfId) {
      return res.status(400).json({ message: "Invalid booking data" });
    }

    const booking = new Booking({
      ...bookingData,
      status: "paid",
      razorpayPaymentId: "demo_txn_" + Date.now(),
    });

    await booking.save();

    // ✅ Email receipt
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: '"BookNJoy" <noreply@booknjoy.com>',
      to: bookingData.userEmail,
      subject: "Booking Confirmation - BookNJoy",
      html: `
        <h3>Booking Confirmed ✅</h3>
        <p>Your booking for <b>${bookingData.slot}</b> on <b>${new Date(
        bookingData.bookingDate
      ).toDateString()}</b> is confirmed.</p>
        <p><b>Amount Paid:</b> ₹${bookingData.price - (bookingData.discountApplied || 0)}</p>
        ${bookingData.promoCode ? `<p>Promo Applied: ${bookingData.promoCode}</p>` : ""}
        <p>Booking ID: ${booking._id}</p>
      `,
    });

    res.json({ success: true, booking });
  } catch (err) {
    console.error("❌ Demo Payment error:", err);
    res.status(500).json({ message: "Error processing demo payment", error: err.message });
  }
});

/**
 * ✅ Get ALL bookings (Admin analytics)
 * Must come BEFORE /:email
 */
router.get("/all", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("turfId");
    res.json(bookings);
  } catch (err) {
    console.error("❌ Fetch all bookings error:", err);
    res.status(500).json({ message: "Error fetching all bookings" });
  }
});

// Get bookings for a specific owner's turf
router.get("/owner/:email", async (req, res) => {
  try {
    const turfs = await Turf.find({ ownerEmail: req.params.email }).select("_id");
    const turfIds = turfs.map((t) => t._id);
    const bookings = await Booking.find({ turfId: { $in: turfIds } }).populate("turfId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching owner bookings" });
  }
});


/**
 * Get bookings by user email
 */
router.get("/:email", async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.params.email }).populate("turfId");
    res.json(bookings);
  } catch (err) {
    console.error("❌ Fetch bookings error:", err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

export default router;
