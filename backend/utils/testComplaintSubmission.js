// Script to test complaint submission
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectDB } = require('../config/db');
const Citizen = require('../models/Citizen');
const Complaint = require('../models/Complaint');
const ComplaintImage = require('../models/ComplaintImage');

// Test citizen data
const testCitizen = {
  full_name: 'Test Citizen',
  gmail: 'testcitizen@govcareai.com',
  phone: '+1234567890',
  password: 'Test@123'
};

// Test complaint data
const testComplaint = {
  title: 'Test Complaint',
  description: 'This is a test complaint for verification purposes.',
  phone: '+1234567890',
  street: '123 Test Street',
  longitude: 77.2088,
  latitude: 28.6139,
  locationType: 'urban'
};

const testComplaintSubmission = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Check if test citizen exists, create if not
    let citizen = await Citizen.findOne({ where: { gmail: testCitizen.gmail } });
    if (!citizen) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testCitizen.password, salt);
      
      // Create test citizen
      citizen = await Citizen.create({
        full_name: testCitizen.full_name,
        gmail: testCitizen.gmail,
        phone: testCitizen.phone,
        password_hash: hashedPassword
      });
      
      console.log('Test citizen created successfully');
    } else {
      console.log('Using existing test citizen');
    }
    
    // Generate JWT token for the citizen
    const token = jwt.sign(
      { id: citizen.citizen_id, userType: 'citizen' },
      process.env.JWT_SECRET || 'govcareai_secret_key',
      { expiresIn: '7d' }
    );
    
    console.log('Generated token for testing:', token);
    
    // Test complaint submission
    const complaintData = {
      citizen_id: citizen.citizen_id,
      title: testComplaint.title,
      description: testComplaint.description,
      phone: testComplaint.phone,
      street: testComplaint.street,
      longitude: testComplaint.longitude,
      latitude: testComplaint.latitude,
      priority: 'LOW',
      ai_score_text: 10,
      ai_score_image: 0,
      ai_score_location: 30,
      ai_score_total: 40.00
    };
    
    // Create complaint directly in database
    const complaint = await Complaint.create(complaintData);
    console.log('Complaint created successfully with ID:', complaint.complaint_id);
    
    // Verify complaint was stored
    const storedComplaint = await Complaint.findByPk(complaint.complaint_id);
    if (storedComplaint) {
      console.log('Complaint successfully stored in database:');
      console.log('- Complaint ID:', storedComplaint.complaint_id);
      console.log('- Title:', storedComplaint.title);
      console.log('- Description:', storedComplaint.description);
      console.log('- Citizen ID:', storedComplaint.citizen_id);
      console.log('- Created At:', storedComplaint.created_at);
    } else {
      console.log('ERROR: Complaint not found in database after creation');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error testing complaint submission:', error);
    process.exit(1);
  }
};

testComplaintSubmission();