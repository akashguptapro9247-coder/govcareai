// Authentication Middleware
const jwt = require('jsonwebtoken');
const Citizen = require('../models/Citizen');
const Admin = require('../models/Admin');

// Middleware to authenticate citizens
const authenticateCitizen = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'govcareai_secret_key');
    
    if (decoded.userType !== 'citizen') {
      return res.status(401).json({ message: 'Access denied. Invalid token.' });
    }
    
    const citizen = await Citizen.findByPk(decoded.id);
    
    if (!citizen) {
      return res.status(401).json({ message: 'Access denied. Citizen not found.' });
    }
    
    req.citizen = citizen;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Middleware to authenticate admins
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'govcareai_secret_key');
    
    if (decoded.userType !== 'admin') {
      return res.status(401).json({ message: 'Access denied. Invalid token.' });
    }
    
    const admin = await Admin.findByPk(decoded.id);
    
    if (!admin) {
      return res.status(401).json({ message: 'Access denied. Admin not found.' });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = { authenticateCitizen, authenticateAdmin };