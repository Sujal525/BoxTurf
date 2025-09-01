import mongoose from "mongoose";

const turfSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      state: { type: String },
      city: { type: String },
      area: { type: String },
      address: { type: String },
      pincode: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    image: { type: String },
    sportsCategory: { type: String, required: true },
    size: { type: String },

    // ✅ Admin-defined base price (cost)
    price: {
      morning: { type: Number, default: 0 },
      afternoon: { type: Number, default: 0 },
      evening: { type: Number, default: 0 },
      night: { type: Number, default: 0 },
    },

    // ✅ Customer-facing price
    customerPrice: {
      morning: { type: Number, default: 0 },
      afternoon: { type: Number, default: 0 },
      evening: { type: Number, default: 0 },
      night: { type: Number, default: 0 },
    },

    createdBy: { type: String, required: true }, // Admin email
    ownerEmail: { type: String, required: true }, // ✅ New field (owner’s email)
  },
  { timestamps: true }
);

export default mongoose.model("Turf", turfSchema);
