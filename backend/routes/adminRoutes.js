// Admin Routes
const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Admin dashboard routes
router.get('/complaints', authenticateAdmin, adminController.getComplaintsWithCitizens);
router.put('/complaints/:complaint_id/status', authenticateAdmin, adminController.updateComplaintStatus);
router.put('/complaints/:complaint_id/priority', authenticateAdmin, adminController.updateComplaintPriority);
router.post('/complaints/:complaint_id/message', authenticateAdmin, adminController.sendMessage);

// Admin stats and maintenance routes
router.get('/stats', authenticateAdmin, adminController.getAdminStats);
router.post('/maintenance', authenticateAdmin, adminController.runDatabaseMaintenance);
router.post('/backup', authenticateAdmin, adminController.backupDatabase);

module.exports = router;