import express from "express";
import Turf from "../models/Turf.js";

const router = express.Router();

// ✅ CREATE
router.post("/", async (req, res) => {
  try {
    const turf = new Turf(req.body);
    await turf.save();
    res.status(201).json(turf);
  } catch (error) {
    console.error("❌ Turf creation error:", error); // log backend error
    res.status(500).json({ message: "Error creating turf", error });
  }
});

// ✅ READ ALL
router.get("/", async (req, res) => {
  try {
    const turfs = await Turf.find();
    res.json(turfs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching turfs", error });
  }
});

// ✅ READ ONE
router.get("/:id", async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) return res.status(404).json({ message: "Turf not found" });
    res.json(turf);
  } catch (error) {
    res.status(500).json({ message: "Error fetching turf", error });
  }
});

// ✅ UPDATE
router.put("/:id", async (req, res) => {
  try {
    const turf = await Turf.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!turf) return res.status(404).json({ message: "Turf not found" });
    res.json(turf);
  } catch (error) {
    res.status(500).json({ message: "Error updating turf", error });
  }
});

// ✅ DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Turf.findByIdAndDelete(req.params.id);
    res.json({ message: "Turf deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting turf", error });
  }
});

// Get turfs by owner
router.get("/owner/:email", async (req, res) => {
  try {
    const turfs = await Turf.find({ ownerEmail: req.params.email });
    res.json(turfs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching owner's turfs" });
  }
});


// ✅ Revenue Analytics
router.get("/analytics/revenue", async (req, res) => {
  try {
    const turfs = await Turf.find();

    const revenue = turfs.map((t) => {
      const costRevenue =
        (t.price?.morning || 0) +
        (t.price?.afternoon || 0) +
        (t.price?.evening || 0) +
        (t.price?.night || 0);

      const customerRevenue =
        (t.customerPrice?.morning || 0) +
        (t.customerPrice?.afternoon || 0) +
        (t.customerPrice?.evening || 0) +
        (t.customerPrice?.night || 0);

      return {
        name: t.name,
        costRevenue,
        customerRevenue,
        profit: customerRevenue - costRevenue,
      };
    });

    res.json(revenue);
  } catch (error) {
    console.error("❌ Analytics error:", error);
    res.status(500).json({ message: "Error fetching analytics", error });
  }
});


export default router;
