const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const crypto = require("crypto");

// Load env vars - this must be first
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Call connectDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Constants for medical API
const LIVE_URL = "https://healthservice.priaid.ch";
const AUTH_URL = "https://authservice.priaid.ch/login";
const API_KEY = process.env.MEDIC_API_KEY || "Cr6f9_UFL_EDU_AUT";
const API_SECRET = process.env.MEDIC_API_SECRET || "Dr3k4K6EnGe2m5LNt";

// Clinic data
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

// Helper function to get token
const getToken = async () => {
  try {
    const computedHash = crypto
      .createHmac("md5", API_SECRET)
      .update(AUTH_URL)
      .digest("base64");

    const response = await axios.post(
      AUTH_URL,
      {},
      {
        headers: {
          Authorization: `Bearer ${API_KEY}:${computedHash}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.Token;
  } catch (error) {
    console.error("Token generation error:", error);
    throw error;
  }
};

// Medical API proxy routes
app.get("/api/symptoms", async (req, res) => {
  try {
    const token = await getToken();
    const response = await axios.get(`${LIVE_URL}/symptoms`, {
      params: {
        token: token,
        format: "json",
        language: "en-gb",
      },
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error(
      "Symptoms fetch error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch symptoms" });
  }
});

app.post("/api/diagnosis", async (req, res) => {
  try {
    const { symptoms, gender, yearOfBirth } = req.body;
    const token = await getToken();
    const response = await axios.get(`${LIVE_URL}/diagnosis`, {
      params: {
        symptoms: JSON.stringify(symptoms),
        gender: gender,
        year_of_birth: yearOfBirth,
        token: token,
        format: "json",
        language: "en-gb",
      },
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Diagnosis error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get diagnosis" });
  }
});

app.get("/api/issues/:issueId", async (req, res) => {
  try {
    const { issueId } = req.params;
    const token = await getToken();
    const response = await axios.get(`${LIVE_URL}/issues/${issueId}/info`, {
      params: {
        token: token,
        format: "json",
        language: "en-gb",
      },
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Issue info error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get issue info" });
  }
});

// Clinic routes
app.get("/api/clinics", (req, res) => {
  const { city } = req.query;
  if (city) {
    const filteredClinics = clinics.filter((clinic) =>
      clinic.address.toLowerCase().includes(city.toLowerCase())
    );
    return res.json(filteredClinics);
  }
  res.json(clinics);
});

app.get("/api/clinics/:id", (req, res) => {
  const clinic = clinics.find((c) => c.id === parseInt(req.params.id));
  if (!clinic) {
    return res.status(404).json({ error: "Clinic not found" });
  }
  res.json(clinic);
});

// User routes
app.use("/api/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
