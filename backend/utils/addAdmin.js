// Script to add a specific admin account to the database
const bcrypt = require('bcryptjs');
const { connectDB } = require('../config/db');
const Admin = require('../models/Admin');

// Admin data
const newAdmin = {
  full_name: 'Government Officer',
  gmail: 'officer123@gmail.com', // Fixed the typo from gamil.com to gmail.com
  password: 'officer123'
};

const addAdmin = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ where: { gmail: newAdmin.gmail } });
    if (existingAdmin) {
      console.log(`Admin with email ${newAdmin.gmail} already exists`);
      console.log(`Email: ${existingAdmin.gmail}`);
      process.exit(0);
    }
    
    // Hash admin password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newAdmin.password, salt);
    
    // Create admin
    const admin = await Admin.create({
      full_name: newAdmin.full_name,
      gmail: newAdmin.gmail,
      password_hash: hashedPassword
    });
    
    console.log('Admin created successfully:');
    console.log(`Full Name: ${admin.full_name}`);
    console.log(`Email: ${admin.gmail}`);
    console.log(`Password: ${newAdmin.password} (for login purposes only)`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding admin:', error);
    process.exit(1);
  }
};

addAdmin();