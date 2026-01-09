// Script to add demo admin and citizen accounts to the database
const bcrypt = require('bcryptjs');
const { connectDB } = require('../config/db');
const Citizen = require('../models/Citizen');
const Admin = require('../models/Admin');

// Demo data
const demoAdmin = {
  full_name: 'Demo Administrator',
  gmail: 'admin@govcareai.com',
  password: 'Admin@123'
};

const demoCitizen = {
  full_name: 'Demo Citizen',
  gmail: 'citizen@govcareai.com',
  phone: '+1234567890',
  password: 'Citizen@123'
};

const seedDemoData = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Check if demo admin already exists
    const existingAdmin = await Admin.findOne({ where: { gmail: demoAdmin.gmail } });
    if (!existingAdmin) {
      // Hash admin password
      const salt = await bcrypt.genSalt(10);
      const hashedAdminPassword = await bcrypt.hash(demoAdmin.password, salt);
      
      // Create demo admin
      const admin = await Admin.create({
        full_name: demoAdmin.full_name,
        gmail: demoAdmin.gmail,
        password_hash: hashedAdminPassword
      });
      
      console.log('Demo admin created successfully:');
      console.log(`Email: ${admin.gmail}`);
      console.log(`Password: ${demoAdmin.password}`);
    } else {
      console.log('Demo admin already exists');
    }
    
    // Check if demo citizen already exists
    const existingCitizen = await Citizen.findOne({ where: { gmail: demoCitizen.gmail } });
    if (!existingCitizen) {
      // Hash citizen password
      const salt = await bcrypt.genSalt(10);
      const hashedCitizenPassword = await bcrypt.hash(demoCitizen.password, salt);
      
      // Create demo citizen
      const citizen = await Citizen.create({
        full_name: demoCitizen.full_name,
        gmail: demoCitizen.gmail,
        phone: demoCitizen.phone,
        password_hash: hashedCitizenPassword
      });
      
      console.log('Demo citizen created successfully:');
      console.log(`Email: ${citizen.gmail}`);
      console.log(`Password: ${demoCitizen.password}`);
    } else {
      console.log('Demo citizen already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding demo data:', error);
    process.exit(1);
  }
};

seedDemoData();