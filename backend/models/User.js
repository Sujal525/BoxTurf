import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    picture: { type: String },
    role: { type: String, enum: ["user", "admin", "owner"], default: "user" },
    auth0Id: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
