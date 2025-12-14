// Load env vars FIRST
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./src/Config/Database");
const authRoutes = require("./src/routes/auth");
const generateRoutes = require("./src/routes/generate");

const app = express();

// ---------------- Middleware ----------------
app.use(express.json());

// Support comma-separated list in CLIENT_ORIGIN for multiple frontends (e.g., prod + localhost)
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map(o => o.trim()).filter(Boolean)
  : [];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // allow same-origin / non-browser clients
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ---------------- DB (SERVERLESS - Connect once) ----------------
connectDB().catch((err) =>
  console.error("DB connection error:", err)
);

// ---------------- Routes ----------------
app.get("/", (req, res) => {
  res.status(200).json({
    message: "API is working",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

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

// ---------------- Start Server (Local Only) ----------------
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✓ Server is running on port ${PORT}`);
  });
}

module.exports = app;
