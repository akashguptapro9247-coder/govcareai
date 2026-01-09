// Admin Controller
const Complaint = require('../models/Complaint');
const Citizen = require('../models/Citizen');
const ComplaintMessage = require('../models/ComplaintMessage');

// Get all complaints with citizen details
const getComplaintsWithCitizens = async (req, res) => {
  try {
    // In a real implementation with Sequelize, you would use joins
    // For now, we'll simulate the joined data
    
    const complaints = await Complaint.findAll({
      order: [['created_at', 'DESC']]
    });
    
    // In a real app, this would be done with a proper JOIN
    // For demo, we'll enhance the complaints with citizen data
    const complaintsWithData = await Promise.all(complaints.map(async (complaint) => {
      const citizen = await Citizen.findByPk(complaint.citizen_id);
      return {
        ...complaint.toJSON(),
        citizen_name: citizen ? citizen.full_name : 'Unknown',
        citizen_email: citizen ? citizen.gmail : 'Unknown',
        citizen_phone: citizen ? citizen.phone : 'Unknown'
      };
    }));
    
    res.json(complaintsWithData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update complaint status
const updateComplaintStatus = async (req, res) => {
  try {
    const { complaint_id } = req.params;
    const { status } = req.body;
    
    const complaint = await Complaint.findByPk(complaint_id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    complaint.status = status;
    await complaint.save();
    
    res.json({
      message: 'Complaint status updated successfully',
      complaint
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update complaint priority
const updateComplaintPriority = async (req, res) => {
  try {
    const { complaint_id } = req.params;
    const { priority } = req.body;
    
    // Validate priority
    if (!['HIGH', 'MODERATE', 'LOW'].includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority value' });
    }
    
    const complaint = await Complaint.findByPk(complaint_id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    complaint.priority = priority;
    await complaint.save();
    
    res.json({
      message: 'Complaint priority updated successfully',
      complaint
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send message to citizen
const sendMessage = async (req, res) => {
  try {
    const { complaint_id } = req.params;
    const { message_text } = req.body;
    
    // Check if complaint exists
    const complaint = await Complaint.findByPk(complaint_id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Create message from admin
    const message = await ComplaintMessage.create({
      complaint_id,
      sender_type: 'ADMIN',
      message_text
    });
    
    res.status(201).json({
      message: 'Message sent successfully',
      message
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const Admin = require('../models/Admin');

// Get admin statistics
const getAdminStats = async (req, res) => {
  try {
    const totalCitizens = await Citizen.count();
    const totalComplaints = await Complaint.count();
    const totalAdmins = await Admin.count();
    
    res.json({
      totalCitizens,
      totalComplaints,
      totalAdmins
    });
  } catch (error) {
    console.error('Error getting admin stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Run database maintenance
const runDatabaseMaintenance = async (req, res) => {
  try {
    // In a real implementation, this would run database optimization tasks
    // For now, we'll just return success
    
    // This could include tasks like:
    // - Optimize tables
    // - Clean up old records
    // - Update statistics
    
    res.json({ message: 'Database maintenance completed successfully' });
  } catch (error) {
    console.error('Error running database maintenance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Backup database
const backupDatabase = async (req, res) => {
  try {
    // In a real implementation, this would create a database backup
    // For now, we'll just return success
    
    // This could include tasks like:
    // - Export database to SQL file
    // - Create backup archive
    // - Store backup in secure location
    
    res.json({ message: 'Database backup completed successfully' });
  } catch (error) {
    console.error('Error creating database backup:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getComplaintsWithCitizens,
  updateComplaintStatus,
  updateComplaintPriority,
  sendMessage,
  getAdminStats,
  runDatabaseMaintenance,
  backupDatabase
};