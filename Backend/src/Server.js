// ================== Imports ==================
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./Config/Database");
const authRoutes = require("./routes/auth");
const generateRoutes = require("./routes/generate");

// ================== Config ==================
dotenv.config();

// ================== App Init ==================
const app = express(); // ✅ THIS WAS MISSING

app.use(express.json());

// ================== CORS ==================
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

// ================== Lazy DB Connection ==================
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

// ================== Routes ==================
app.use("/api/auth", authRoutes);
app.use("/api/generate", generateRoutes);

// ================== 404 ==================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ================== Error Handler ==================
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ================== Local Server Only ==================
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

// ================== Export for Vercel ==================
module.exports = app;
