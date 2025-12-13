const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  validateUserRegistration,
  validateUserLogin,
} = require("../utils/validation");

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post("/signup", async (req, res) => {
  try {
    // Validate input data
    const { isValid, errors } = validateUserRegistration(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }

    const { firstname, lastname, email, password } = req.body;

    // Check if user already exists (case-insensitive email check)
    const existingUser = await User.findOne({ 
      email: email.toLowerCase() 
    }).select('_id').lean(); // Use lean() for better performance
    
    if (existingUser) {
      return res.status(409).json({ 
        message: "User already exists with this email" 
      });
    }

    // Hash password with bcrypt (salt rounds = 10 for security/performance balance)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user document
    const newUser = new User({
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();
    
    // Return success response without sensitive data
    res.status(201).json({ 
      message: "User registered successfully",
      user: {
        id: newUser._id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Server error during registration" });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT token
 * @access  Public
 */
router.post("/login", async (req, res) => {
  try {
    // Validate input data
    const { isValid, errors } = validateUserLogin(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }

    const { email, password } = req.body;

    // Find user by email and select password field (case-insensitive)
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).select('+password'); // Include password field
    
    if (!user) {
      // Use generic message to prevent email enumeration
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token with user payload
    const token = jwt.sign(
      { 
        _id: user._id, 
        email: user.email 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: "24h", // Token valid for 24 hours
        algorithm: 'HS256' // Specify algorithm for security
      }
    );

    // Set secure HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent XSS attacks
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // CSRF protection
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    // Return success response with user data (exclude password)
    res.status(200).json({ 
      message: "Login successful", 
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and clear authentication token
 * @access  Private (requires valid token)
 */
router.post("/logout", (req, res) => {
  try {
    // Clear the authentication cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Return success response
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
});

module.exports = router;
