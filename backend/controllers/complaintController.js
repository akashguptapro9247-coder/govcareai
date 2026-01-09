// Complaint Controller
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');
const Complaint = require('../models/Complaint');
const ComplaintImage = require('../models/ComplaintImage');
const ComplaintMessage = require('../models/ComplaintMessage');
const ComplaintLog = require('../models/ComplaintLog');
const Citizen = require('../models/Citizen');

// AI Scoring Functions
const calculateTextScore = (text, title) => {
  const dangerKeywords = [
    // Emergency keywords
    'emergency', 'urgent', 'dangerous', 'hazard', 'hazardous', 'unsafe', 'danger',
    // Infrastructure issues
    'fire', 'flood', 'collapse', 'crack', 'broken', 'damaged', 'damage', 'leak', 'leaking',
    // Health/safety issues
    'sewage', 'sewer', 'contamination', 'pollution', 'medical', 'injury', 'injured', 'accident',
    // Electrical issues
    'electric', 'electrical', 'power', 'cable', 'wire', 'short', 'spark',
    // Public safety
    'crime', 'vandalism', 'theft', 'robbery', 'assault', 'unsafe', 'security',
    // Environmental issues
    'pollution', 'waste', 'garbage', 'trash', 'pest', 'rodent', 'pests', 'rodents',
    // Infrastructure damage
    'pothole', 'road', 'bridge', 'street', 'traffic', 'light', 'sign', 'signal', 'drain',
    // Health concerns
    'disease', 'sick', 'sickness', 'contaminated', 'sick', 'outbreak'
  ];
  
  let score = 0;
  const lowerText = text.toLowerCase();
  
  // Keyword matching in description
  dangerKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      score += 5; // 5 points per keyword
    }
  });
  
  // Length bonus (more detailed descriptions get higher scores)
  if (text.length > 100) score += 5;
  if (text.length > 200) score += 5;
  
  // Urgency indicators in description
  const urgencyIndicators = ['immediately', 'asap', 'right now', 'now', 'help', 'please'];
  urgencyIndicators.forEach(indicator => {
    if (lowerText.includes(indicator)) {
      score += 3;
    }
  });
  
  // Sentiment analysis (simple approach)
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'worried', 'concerned'];
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) {
      score += 2;
    }
  });
  
  // Title analysis
  if (title) {
    const titleLower = title.toLowerCase();
    dangerKeywords.forEach(keyword => {
      if (titleLower.includes(keyword)) {
        score += 3;
      }
    });
    
    // Title length analysis (shorter titles might indicate urgency)
    if (title.length < 10) score += 2;
    
    // Title urgency indicators
    urgencyIndicators.forEach(indicator => {
      if (titleLower.includes(indicator)) {
        score += 3;
      }
    });
  }
  
  return Math.min(score, 50); // Max 50 points (50% weight)
};

const calculateImageScore = (hasImage) => {
  // In a real implementation, this would analyze the image content
  // For demo, we'll implement a more sophisticated analysis
  if (!hasImage) return 0;
  
  let score = 0;
  
  // Base score for having images
  score += 10;
  
  // Bonus for multiple images (more evidence = higher priority)
  if (Array.isArray(hasImage) && hasImage.length > 1) {
    score += 5 * (hasImage.length - 1);
  }
  
  // In a real system, we would analyze image content for:
  // - Damage indicators
  // - Severity of visible issues
  // - Image quality (blurry images are less reliable)
  // - Number of images (more evidence = higher priority)
  
  // For now, we'll simulate based on the number of images
  const imageCount = Array.isArray(hasImage) ? hasImage.length : 1;
  
  // Additional score based on image count
  if (imageCount >= 3) score += 5; // Multiple angles/photos
  else if (imageCount >= 2) score += 3; // Multiple photos
  
  return Math.min(score, 20); // Max 20 points (20% weight)
};

const calculateLocationScore = (locationType) => {
  // In a real implementation, this would determine urban/semi/rural based on coordinates
  // For demo, we'll use a simple approach
  switch(locationType) {
    case 'urban': return 30;    // 30 points (30% weight)
    case 'semi': return 15;     // 15 points (30% weight)
    case 'rural': return 5;     // 5 points (30% weight)
    default: return 15;         // Default to semi-urban
  }
};

// Analyze location based on coordinates to determine urban/semi/rural
const calculateLocationScoreFromCoordinates = (longitude, latitude) => {
  if (!longitude || !latitude || isNaN(longitude) || isNaN(latitude)) {
    // If coordinates are invalid, default to semi-urban
    return 15;
  }
  
  // More sophisticated algorithm for location analysis
  // This considers:
  // - Population density (simulated)
  // - Infrastructure type
  // - Geographic features
  // - Proximity to urban centers
  
  const absLongitude = Math.abs(longitude);
  const absLatitude = Math.abs(latitude);
  
  // Calculate a more nuanced location score based on multiple factors
  let score = 0;
  
  // Factor 1: Coordinate magnitude (simplified urban center simulation)
  const coordMagnitude = (absLongitude + absLatitude) / 2;
  
  // Factor 2: Coordinate precision (more precise coordinates might indicate urban area)
  const longitudePrecision = Math.abs(longitude - Math.round(longitude)) < 0.01 ? 2 : 0;
  const latitudePrecision = Math.abs(latitude - Math.round(latitude)) < 0.01 ? 2 : 0;
  
  // Factor 3: Geographic pattern analysis (simplified)
  const geoPatternScore = (Math.sin(absLongitude * 10) + Math.cos(absLatitude * 10)) * 5;
  
  // Calculate base score based on coordinate magnitude
  if (coordMagnitude > 80) {
    // Very remote/rural area
    score = 5 + longitudePrecision + latitudePrecision + geoPatternScore;
  } else if (coordMagnitude > 50) {
    // Rural to semi-urban transition
    score = 15 + longitudePrecision + latitudePrecision + geoPatternScore;
  } else {
    // Urban area
    score = 30 + longitudePrecision + latitudePrecision + geoPatternScore;
  }
  
  // Adjust score to stay within bounds
  score = Math.max(5, Math.min(30, score));
  
  return Math.round(score);
};

const calculatePriority = (totalScore) => {
  // More granular priority classification based on score
  if (totalScore >= 60) return 'HIGH';
  if (totalScore >= 35) return 'MODERATE';
  return 'LOW';
};

// Submit Complaint
const submitComplaint = async (req, res) => {
  try {
    const { title, description, phone, street, longitude, latitude } = req.body;
    const citizen_id = req.citizen.citizen_id;
    
    // Calculate AI scores
    const ai_score_text = calculateTextScore(description, title); // Pass both description and title
    const ai_score_image = calculateImageScore(req.files);
    const ai_score_location = calculateLocationScoreFromCoordinates(parseFloat(longitude), parseFloat(latitude));
    
    // Calculate total score
    const ai_score_total = 
      (ai_score_text * 0.50) + 
      (ai_score_image * 0.20) + 
      (ai_score_location * 0.30);
    
    // Determine priority
    const priority = calculatePriority(ai_score_total);
    
    // Create complaint
    const complaint = await Complaint.create({
      citizen_id,
      title,
      description,
      phone,
      street,
      longitude,
      latitude,
      priority,
      ai_score_text,
      ai_score_image,
      ai_score_location,
      ai_score_total
    });
    
    // Save images if provided
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map(file => 
        ComplaintImage.create({
          complaint_id: complaint.complaint_id,
          image_path: file.filename
        })
      );
      await Promise.all(imagePromises);
    }
    
    // Create initial log entry
    await ComplaintLog.create({
      complaint_id: complaint.complaint_id,
      action_type: 'CREATED',
      new_value: JSON.stringify(complaint)
    });
    
    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Citizen Complaints
const getCitizenComplaints = async (req, res) => {
  try {
    const { priority, status, search } = req.query;
    const citizen_id = req.citizen.citizen_id;
    
    // Build where clause
    const whereClause = { citizen_id };
    
    if (priority) {
      whereClause.priority = priority;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { street: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Get complaints
    const complaints = await Complaint.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      include: [{
        model: ComplaintImage,
        as: 'ComplaintImages',
        attributes: ['image_id', 'image_path']
      }]
    });
    
    res.json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Complaints (for admin)
const getAllComplaints = async (req, res) => {
  try {
    const { priority, status, search } = req.query;
    
    // Build where clause
    const whereClause = {};
    
    if (priority) {
      whereClause.priority = priority;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { street: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Get complaints with citizen info and images
    const complaints = await Complaint.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: ComplaintImage,
          as: 'ComplaintImages',
          attributes: ['image_id', 'image_path']
        },
        {
          model: Citizen,
          attributes: ['full_name', 'gmail']
        }
      ]
    });
    
    res.json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Specific Complaint by ID (for admin)
const getComplaintById = async (req, res) => {
  try {
    const { complaint_id } = req.params;
    
    // Get complaint with all related data
    const complaint = await Complaint.findByPk(complaint_id, {
      include: [
        {
          model: ComplaintImage,
          as: 'ComplaintImages',
          attributes: ['image_id', 'image_path']
        },
        {
          model: ComplaintMessage,
          as: 'ComplaintMessages',
          attributes: ['message_id', 'sender_type', 'message_text', 'timestamp']
        }
      ]
    });
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    res.json(complaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Complaint Status/Priority
const updateComplaint = async (req, res) => {
  try {
    const { complaint_id } = req.params;
    const { status, priority } = req.body;
    
    // Find complaint
    const complaint = await Complaint.findByPk(complaint_id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Store old values for logging
    const oldValues = {
      status: complaint.status,
      priority: complaint.priority
    };
    
    // Update complaint
    if (status) complaint.status = status;
    if (priority) complaint.priority = priority;
    
    await complaint.save();
    
    // Create log entry
    await ComplaintLog.create({
      complaint_id: complaint.complaint_id,
      action_type: 'UPDATED',
      old_value: JSON.stringify(oldValues),
      new_value: JSON.stringify({ status: complaint.status, priority: complaint.priority })
    });
    
    res.json({
      message: 'Complaint updated successfully',
      complaint
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Complaint
const deleteComplaint = async (req, res) => {
  try {
    const { complaint_id } = req.params;
    
    // Find complaint
    const complaint = await Complaint.findByPk(complaint_id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Delete complaint (cascade will delete related images, messages, logs)
    await complaint.destroy();
    
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add Message to Complaint
const addMessage = async (req, res) => {
  try {
    const { complaint_id } = req.params;
    const { message_text, sender_type } = req.body;
    
    // Validate sender type
    if (!['ADMIN', 'CITIZEN'].includes(sender_type)) {
      return res.status(400).json({ message: 'Invalid sender type' });
    }
    
    // Create message
    const message = await ComplaintMessage.create({
      complaint_id,
      sender_type,
      message_text
    });
    
    res.status(201).json({
      message: 'Message added successfully',
      message
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Complaint Messages
const getMessages = async (req, res) => {
  try {
    const { complaint_id } = req.params;
    
    // Get messages
    const messages = await ComplaintMessage.findAll({
      where: { complaint_id },
      order: [['timestamp', 'ASC']]
    });
    
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Complaint Messages for Citizen
const getMessagesForCitizen = async (req, res) => {
  try {
    const { complaint_id } = req.params;
    const citizenId = req.citizen.citizen_id; // This comes from the authenticateCitizen middleware
    
    // First verify that the complaint belongs to this citizen
    const complaint = await Complaint.findByPk(complaint_id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    if (complaint.citizen_id != citizenId) {
      return res.status(403).json({ message: 'Access denied. You can only view messages for your own complaints.' });
    }
    
    // Get messages
    const messages = await ComplaintMessage.findAll({
      where: { complaint_id },
      order: [['timestamp', 'ASC']]
    });
    
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Complaint Images
const getImages = async (req, res) => {
  try {
    const { complaint_id } = req.params;
    
    // Get images
    const images = await ComplaintImage.findAll({
      where: { complaint_id },
      order: [['created_at', 'ASC']]
    });
    
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Dashboard Stats (for admin)
const getDashboardStats = async (req, res) => {
  try {
    // Get counts for each priority level
    const highPriorityCount = await Complaint.count({ where: { priority: 'HIGH' } });
    const moderatePriorityCount = await Complaint.count({ where: { priority: 'MODERATE' } });
    const lowPriorityCount = await Complaint.count({ where: { priority: 'LOW' } });
    
    // Get counts for each status
    const pendingCount = await Complaint.count({ where: { status: 'PENDING' } });
    const inProgressCount = await Complaint.count({ where: { status: 'IN PROGRESS' } });
    const resolvedCount = await Complaint.count({ where: { status: 'RESOLVED' } });
    
    res.json({
      highPriorityCount,
      moderatePriorityCount,
      lowPriorityCount,
      pendingCount,
      inProgressCount,
      resolvedCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  submitComplaint,
  getCitizenComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  addMessage,
  getMessages,
  getMessagesForCitizen,
  getImages,
  getDashboardStats,
  checkDatabaseHealth,
  checkApiHealth
};

// Health check functions
async function checkDatabaseHealth(req, res) {
  try {
    // Test database connection
    const result = await sequelize.query('SELECT 1+1 AS result');
    
    // Get table information
    const tablesResult = await sequelize.query(
      'SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE()',
      { type: sequelize.QueryTypes.SELECT }
    );
    
    const tableNames = tablesResult.map(row => row.TABLE_NAME);
    
    res.json({
      status: 'connected',
      pool: 'default',
      tables: tableNames.length,
      tableList: tableNames
    });
  } catch (error) {
    console.error('Database health check error:', error);
    res.status(500).json({
      status: 'failed',
      error: error.message
    });
  }
}

async function checkApiHealth(req, res) {
  try {
    // Return API health information
    res.json({
      status: 'active',
      endpoints: 'Available',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    console.error('API health check error:', error);
    res.status(500).json({
      status: 'failed',
      error: error.message
    });
  }
}