const validator = require('validator');

// Validate user registration input
const validateUserRegistration = (data) => {
  const errors = {};

  // Validate firstname
  if (!data.firstname) {
    errors.firstname = "First name is required";
  } else if (data.firstname.length < 3) {
    errors.firstname = "First name must be at least 3 characters";
  } else if (data.firstname.length > 50) {
    errors.firstname = "First name cannot exceed 50 characters";
  } else if (!/^[A-Za-z]+$/.test(data.firstname)) {
    errors.firstname = "First name must contain only alphabets";
  }

  // Validate lastname
  if (!data.lastname) {
    errors.lastname = "Last name is required";
  } else if (data.lastname.length < 3) {
    errors.lastname = "Last name must be at least 3 characters";
  } else if (data.lastname.length > 50) {
    errors.lastname = "Last name cannot exceed 50 characters";
  } else if (!/^[A-Za-z]+$/.test(data.lastname)) {
    errors.lastname = "Last name must contain only alphabets";
  }

  // Validate email
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!validator.isEmail(data.email)) {
    errors.email = "Please provide a valid email address";
  }

  // Validate password
  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters long";
  } else if (!validator.isStrongPassword(data.password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })) {
    errors.password = "Password must contain uppercase, lowercase, numbers, and special characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate user login input
const validateUserLogin = (data) => {
  const errors = {};

  // Validate email
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!validator.isEmail(data.email)) {
    errors.email = "Please provide a valid email address";
  }

  // Validate password
  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters long";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate email
const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }
  if (!validator.isEmail(email)) {
    return { isValid: false, error: "Please provide a valid email address" };
  }
  return { isValid: true };
};

// Validate password strength
const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }
  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters long" };
  }
  if (!validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })) {
    return { 
      isValid: false, 
      error: "Password must contain uppercase, lowercase, numbers, and special characters" 
    };
  }
  return { isValid: true };
};

// Validate name fields
const validateName = (name, fieldName = "Name") => {
  if (!name) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  if (name.length < 3) {
    return { isValid: false, error: `${fieldName} must be at least 3 characters` };
  }
  if (name.length > 50) {
    return { isValid: false, error: `${fieldName} cannot exceed 50 characters` };
  }
  if (!/^[A-Za-z]+$/.test(name)) {
    return { isValid: false, error: `${fieldName} must contain only alphabets` };
  }
  return { isValid: true };
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateEmail,
  validatePassword,
  validateName
};
