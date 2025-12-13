// Load environment variables FIRST before any other imports
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require("./Config/Database");
const authRoutes = require("./routes/auth");
const generateRoutes = require("./routes/generate");

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

// Connect to database and start server
connectDB()
    .then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`✓ Server is running on port ${PORT}`);
            console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    })
    .catch((error) => {
        console.error("✗ Failed to start server:", error);
        process.exit(1);
    });

// Export for serverless
module.exports = app;
