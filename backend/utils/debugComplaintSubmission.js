// Debug script to test complaint submission with file uploads
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectDB } = require('../config/db');
const Citizen = require('../models/Citizen');
const Complaint = require('../models/Complaint');

// Test citizen data
const testCitizen = {
  full_name: 'Debug Citizen',
  gmail: 'debugcitizen@govcareai.com',
  phone: '+1234567890',
  password: 'Debug@123'
};

const debugComplaintSubmission = async () => {
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
      
      console.log('Debug citizen created successfully');
    } else {
      console.log('Using existing debug citizen');
    }
    
    // Generate JWT token for the citizen
    const token = jwt.sign(
      { id: citizen.citizen_id, userType: 'citizen' },
      process.env.JWT_SECRET || 'govcareai_secret_key',
      { expiresIn: '7d' }
    );
    
    console.log('Generated token for debugging:', token);
    
    // Create a simple text file for testing upload
    const testFilePath = path.join(__dirname, 'test-upload.txt');
    fs.writeFileSync(testFilePath, 'This is a test file for complaint image upload debugging.');
    
    console.log('Created test file for upload simulation');
    console.log('Test file path:', testFilePath);
    
    // Test complaint data
    const complaintData = {
      title: 'Debug Complaint with File',
      description: 'This is a debug complaint to test file uploads and database storage.',
      phone: '+1234567890',
      street: '456 Debug Avenue',
      longitude: 77.2088,
      latitude: 28.6139,
      locationType: 'urban'
    };
    
    console.log('Complaint data to be submitted:', complaintData);
    
    // Show how the data should be structured for the backend
    console.log('\n--- Expected Backend Processing ---');
    console.log('1. Authentication: Token should be validated');
    console.log('2. Multer: Should process file uploads to uploads/ directory');
    console.log('3. Controller: Should receive req.body and req.files');
    console.log('4. Database: Complaint should be created with citizen_id');
    console.log('5. Database: Images should be linked to complaint_id');
    
    process.exit(0);
  } catch (error) {
    console.error('Error in debug complaint submission:', error);
    process.exit(1);
  }
};

debugComplaintSubmission();