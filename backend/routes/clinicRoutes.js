const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/userModel");

const clinics = [
  {
    id: 1,
    name: "UF Health Family Medicine - Main",
    lat: 29.6399,
    lng: -82.3447,
    address: "1707 N Main St, Gainesville, FL 32609",
    phone: "(352) 265-1234",
    type: "Primary Care",
  },
  {
    id: 2,
    name: "CareSpot Urgent Care - Gainesville",
    lat: 29.6272,
    lng: -82.3758,
    address: "3581 SW Archer Rd, Gainesville, FL 32608",
    type: "Urgent Care",
  },
  {
    id: 3,
    name: "UF Health Shands Hospital",
    lat: 29.6392,
    lng: -82.3438,
    address: "1600 SW Archer Rd, Gainesville, FL 32610",
    type: "Hospital",
  },
  {
    id: 4,
    name: "North Florida Regional Medical Center",
    lat: 29.6651,
    lng: -82.375,
    address: "6500 W Newberry Rd, Gainesville, FL 32605",
    type: "Hospital",
  },
  {
    id: 5,
    name: "Gainesville VA Medical Center",
    lat: 29.6451,
    lng: -82.3684,
    address: "1601 SW Archer Rd, Gainesville, FL 32608",
    type: "Hospital",
  },
];

router.get("/", (req, res) => {
  const { city } = req.query;
  if (city) {
    const filteredClinics = clinics.filter((clinic) =>
      clinic.address.toLowerCase().includes(city.toLowerCase())
    );
    return res.json(filteredClinics);
  }
  res.json(clinics);
});

router.get("/:id", (req, res) => {
  const clinic = clinics.find((c) => c.id === parseInt(req.params.id));
  if (!clinic) {
    return res.status(404).json({ error: "Clinic not found" });
  }
  res.json(clinic);
});

router.post("/:id/favorite", protect, async (req, res) => {
  try {
    const clinicId = parseInt(req.params.id);
    const user = await User.findById(req.user.id);

    if (!user.favoriteClinics) {
      user.favoriteClinics = [];
    }

    const index = user.favoriteClinics.indexOf(clinicId);
    if (index === -1) {
      user.favoriteClinics.push(clinicId);
    } else {
      user.favoriteClinics.splice(index, 1);
    }

    await user.save();
    console.log("Updated favorites:", user.favoriteClinics);
    res.json({
      favoriteClinics: user.favoriteClinics,
      isFavorited: index === -1,
    });
  } catch (error) {
    console.error("Favorite error:", error);
    res.status(500).json({ error: "Failed to update favorites" });
  }
});

router.get("/favorites", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.favoriteClinics) {
      user.favoriteClinics = [];
      await user.save();
    }
    const favoriteClinics = clinics.filter((clinic) =>
      user.favoriteClinics.includes(clinic.id)
    );
    res.json(favoriteClinics);
  } catch (error) {
    console.error("Fetch favorites error:", error);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

module.exports = router;
