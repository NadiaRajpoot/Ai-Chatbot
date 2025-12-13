// Load env vars FIRST
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./Config/Database");
const authRoutes = require("./routes/auth");
const generateRoutes = require("./routes/generate");

const app = express();

// ---------------- Middleware ----------------
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

// ---------------- DB (SERVERLESS SAFE) ----------------
let dbConnected = false;

app.use(async (req, res, next) => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
      console.log("✓ Database connected");
    } catch (error) {
      console.error("✗ Database connection failed:", error);
      return res.status(503).json({ message: "Database unavailable" });
    }
  }
  next();
});

// ---------------- Routes ----------------
app.use("/api/auth", authRoutes);
app.use("/api/generate", generateRoutes);

// ---------------- 404 ----------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ---------------- Error Handler ----------------
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;
