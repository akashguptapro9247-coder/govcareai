// Authentication Controller
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const Citizen = require('../models/Citizen');
const Admin = require('../models/Admin');

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'govcareai.test@gmail.com',
    pass: process.env.EMAIL_PASS || 'govcareai_test_password'  // In production, use app-specific password
  }
});

// Citizen Registration
const registerCitizen = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { full_name, gmail, phone, password, confirm_password } = req.body;

    // Check if passwords match
    if (password !== confirm_password) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if citizen already exists
    const existingCitizen = await Citizen.findOne({ where: { gmail } });
    if (existingCitizen) {
      return res.status(400).json({ message: 'Citizen with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new citizen
    const citizen = await Citizen.create({
      full_name,
      gmail,
      phone,
      password_hash: hashedPassword
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: citizen.citizen_id, userType: 'citizen' },
      process.env.JWT_SECRET || 'govcareai_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Citizen registered successfully',
      token,
      citizen: {
        citizen_id: citizen.citizen_id,
        full_name: citizen.full_name,
        gmail: citizen.gmail,
        phone: citizen.phone
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Citizen Login
const loginCitizen = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { gmail, password } = req.body;

    // Check if citizen exists
    const citizen = await Citizen.findOne({ where: { gmail } });
    if (!citizen) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, citizen.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: citizen.citizen_id, userType: 'citizen' },
      process.env.JWT_SECRET || 'govcareai_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      citizen: {
        citizen_id: citizen.citizen_id,
        full_name: citizen.full_name,
        gmail: citizen.gmail,
        phone: citizen.phone
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { gmail, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ where: { gmail } });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.admin_id, userType: 'admin' },
      process.env.JWT_SECRET || 'govcareai_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: {
        admin_id: admin.admin_id,
        full_name: admin.full_name,
        gmail: admin.gmail
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { gmail } = req.body;
    
    // Check if citizen exists
    const citizen = await Citizen.findOne({ where: { gmail } });
    
    // We don't reveal if the email exists for security reasons
    if (!citizen) {
      // Send success message anyway to prevent email enumeration
      return res.json({ message: 'If your email is registered, you will receive a password reset link.' });
    }
    
    // Generate a 4-digit code
    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Store the code and user ID in a temporary storage (in a real app, use Redis or database)
    // For demo purposes, we'll use a simple object (not suitable for production)
    if (!global.resetCodes) {
      global.resetCodes = {};
    }
    
    // Store the code with expiry time (5 minutes)
    global.resetCodes[resetCode] = {
      userId: citizen.citizen_id,
      expiry: Date.now() + 5 * 60 * 1000, // 5 minutes from now
      email: gmail
    };
    
    // Return the code (in a real app, this would be sent via email/SMS)
    res.json({ 
      message: 'Password reset code generated successfully',
      resetCode: resetCode
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { code, password } = req.body;
    
    if (!code || !password) {
      return res.status(400).json({ message: 'Code and password are required' });
    }
    
    // Check if the code exists in our temporary storage
    const resetData = global.resetCodes && global.resetCodes[code];
    
    if (!resetData) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }
    
    // Check if code has expired
    if (resetData.expiry < Date.now()) {
      // Remove expired code
      if (global.resetCodes) {
        delete global.resetCodes[code];
      }
      return res.status(400).json({ message: 'Reset code has expired' });
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Update the user's password
    const citizen = await Citizen.findByPk(resetData.userId);
    if (!citizen) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await citizen.update({ password_hash: hashedPassword });
    
    // Remove the used code
    if (global.resetCodes) {
      delete global.resetCodes[code];
    }
    
    res.json({ message: 'Password reset successfully' });
    
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerCitizen,
  loginCitizen,
  loginAdmin,
  forgotPassword,
  resetPassword
};