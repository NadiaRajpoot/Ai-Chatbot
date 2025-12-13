// Import required modules
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require("./Config/Database");
const authRoutes = require("./routes/auth");

// Load environment variables
dotenv.config();

// Require routes that depend on environment variables after loading .env
const generateRoutes = require("./routes/generate");

// Initialize Express app
const app = express();

app.use(express.json());

// CORS: allow frontend origin and credentials (cookies)
const allowedOrigin = process.env.CLIENT_ORIGIN ;
app.use(cors({
    origin: allowedOrigin,
    credentials: true,
}));




// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/generate", generateRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
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