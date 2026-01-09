// Test script to verify frontend can submit complaints
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectDB } = require('../config/db');
const Citizen = require('../models/Citizen');
const Complaint = require('../models/Complaint');

// Test citizen data
const testCitizen = {
  full_name: 'Frontend Test Citizen',
  gmail: 'frontendtest@govcareai.com',
  phone: '+1234567890',
  password: 'FrontendTest@123'
};

const frontendTest = async () => {
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
      
      console.log('Frontend test citizen created successfully');
    } else {
      console.log('Using existing frontend test citizen');
    }
    
    // Generate JWT token for the citizen
    const token = jwt.sign(
      { id: citizen.citizen_id, userType: 'citizen' },
      process.env.JWT_SECRET || 'govcareai_secret_key',
      { expiresIn: '7d' }
    );
    
    console.log('Generated token for frontend testing:', token);
    
    console.log('\n--- Instructions for Manual Testing ---');
    console.log('1. Open your browser and go to: http://localhost:5000/citizen-login.html');
    console.log('2. Login with the following credentials:');
    console.log('   Email: frontendtest@govcareai.com');
    console.log('   Password: FrontendTest@123');
    console.log('3. After login, you will be redirected to the home page');
    console.log('4. Click on "REPORT COMPLAINT" button');
    console.log('5. Fill out the complaint form with test data');
    console.log('6. Click "SUBMIT COMPLAINT"');
    console.log('7. Check if success message appears');
    console.log('8. Verify complaint was added to database by running this script again');
    
    console.log('\n--- Alternative Automated Test ---');
    console.log('If you want to test the API directly, you can use a tool like Postman or curl:');
    console.log('POST http://localhost:5000/api/complaints');
    console.log('Headers: Authorization: Bearer ' + token);
    console.log('Body: form-data with title, description, phone, street, longitude, latitude, locationType');
    
    process.exit(0);
  } catch (error) {
    console.error('Error in frontend test:', error);
    process.exit(1);
  }
};

frontendTest();