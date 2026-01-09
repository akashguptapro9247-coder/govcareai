// Complaint Routes
const express = require('express');
const multer = require('multer');
const complaintController = require('../controllers/complaintController');
const { authenticateCitizen, authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Citizen routes
router.post('/', authenticateCitizen, upload.array('images', 5), complaintController.submitComplaint);
router.get('/my-complaints', authenticateCitizen, complaintController.getCitizenComplaints);

// Admin routes
router.get('/all', authenticateAdmin, complaintController.getAllComplaints);
router.get('/:complaint_id', authenticateAdmin, complaintController.getComplaintById);
router.put('/:complaint_id', authenticateAdmin, complaintController.updateComplaint);
router.delete('/:complaint_id', authenticateAdmin, complaintController.deleteComplaint);
router.post('/:complaint_id/messages', authenticateAdmin, complaintController.addMessage);
router.get('/:complaint_id/messages', authenticateAdmin, complaintController.getMessages);
router.get('/my-complaints/:complaint_id/messages', authenticateCitizen, complaintController.getMessagesForCitizen);
router.get('/:complaint_id/images', authenticateAdmin, complaintController.getImages);
router.get('/dashboard/stats', authenticateAdmin, complaintController.getDashboardStats);

// Health check routes
router.get('/health/database', authenticateAdmin, complaintController.checkDatabaseHealth);
router.get('/health/api', authenticateAdmin, complaintController.checkApiHealth);

module.exports = router;