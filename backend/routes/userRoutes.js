import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Existing: POST /login (already in your code)
router.post("/login", async (req, res) => {
  try {
    const { name, email, picture, auth0Id, role } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, picture, auth0Id, role });
      await user.save();
    } else {
      // Update role if it changed
      user.role = role || user.role;
      await user.save();
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error saving user", error: err });
  }
});

// ✅ NEW: GET user by email (for Navbar, Dashboard role fetch)
router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err });
  }
});

export default router;
