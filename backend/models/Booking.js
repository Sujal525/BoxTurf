import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    turfId: { type: mongoose.Schema.Types.ObjectId, ref: "Turf", required: true },
    userEmail: { type: String, required: true },
    bookingDate: { type: Date, required: true },
    slot: { type: String, enum: ["morning", "afternoon", "evening", "night"], required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },
    razorpayPaymentId: { type: String },
    promoCode: { type: String },
    discountApplied: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
