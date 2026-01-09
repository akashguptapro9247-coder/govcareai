// Authentication Routes
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

// Citizen Registration
router.post('/register', 
  [
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('gmail').isEmail().withMessage('Please provide a valid email'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirm_password').notEmpty().withMessage('Please confirm your password')
  ],
  authController.registerCitizen
);

// Citizen Login
router.post('/login/citizen',
  [
    body('gmail').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  authController.loginCitizen
);

// Admin Login
router.post('/login/admin',
  [
    body('gmail').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  authController.loginAdmin
);

// Forgot Password
router.post('/forgot-password',
  [
    body('gmail').isEmail().withMessage('Please provide a valid email')
  ],
  authController.forgotPassword
);

// Reset Password
router.post('/reset-password',
  [
    body('code').notEmpty().withMessage('Reset code is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  authController.resetPassword
);

module.exports = router;