const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { protect } = require("../middleware/authMiddleware");

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, city, state } =
      req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      city,
      state,
    });

    if (user) {
      res.status(201).json({
        message: "User created successfully",
      });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body);

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log("Missing email or password");
      return res
        .status(400)
        .json({ error: "Please provide email and password" });
    }

    // Find user
    const user = await User.findOne({ email });
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("Password does not match");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    console.log("Login successful, sending response");

    // Send response
    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});
// Get profile route
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Error fetching profile" });
  }
});

// Update profile route
router.put("/profile", protect, async (req, res) => {
  try {
    const { firstName, lastName, phone, city, state } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phone = phone || user.phone;
    user.city = city || user.city;
    user.state = state || user.state;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      city: updatedUser.city,
      state: updatedUser.state,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Error updating profile" });
  }
});

module.exports = router;
