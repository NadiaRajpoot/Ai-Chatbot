const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "First name is required!"],
    trim: true,
    minlength: [3, "First name must be at least 3 characters"],
    maxlength: [50, "First name cannot exceed 50 characters"],
    validate: {
      validator: (val) => /^[A-Za-z]+$/.test(val),
      message: "First name must contain only alphabets"
    }
  },

  lastname: {
    type: String,
    required: [true, "Last name is required!"],
    trim: true,
    minlength: [3, "Last name must be at least 3 characters"],
    maxlength: [50, "Last name cannot exceed 50 characters"],
    validate: {
      validator: (val) => /^[A-Za-z]+$/.test(val),
      message: "Last name must contain only alphabets"
    }
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true,
    unique: [true, "Email already exists"],
    validate: {
      validator: (email) => validator.isEmail(email),
      message: "Please provide a valid email address"
    }
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    validate: {
      validator: (password) =>
        validator.isStrongPassword(password, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        }),
      message:
        "Password must include uppercase, lowercase, number, and a symbol"
    }
  }});

  module.exports = mongoose.model("User", userSchema);