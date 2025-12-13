const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require("./Config/Database");
const authRoutes = require("./routes/auth");
const generateRoutes = require("./routes/generate");

dotenv.config();

const app = express();

app.use(express.json());

// CORS
app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
}));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/generate", generateRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ 
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Connect to DB before exporting (for serverless)
connectDB().catch(err => {
    console.error("DB connection failed:", err);
});

module.exports = app;
