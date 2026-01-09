// Health Check Routes
const express = require('express');
const { checkDatabaseHealth, checkApiHealth } = require('../controllers/complaintController');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Health check routes (admin only)
router.get('/database', authenticateAdmin, checkDatabaseHealth);
router.get('/api', authenticateAdmin, checkApiHealth);

module.exports = router;