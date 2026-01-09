// Complaint Model
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Citizen = require('./Citizen');

const Complaint = sequelize.define('Complaint', {
  complaint_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  citizen_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Citizen,
      key: 'citizen_id'
    }
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  street: {
    type: DataTypes.STRING(200)
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 8)
  },
  latitude: {
    type: DataTypes.DECIMAL(11, 8)
  },
  priority: {
    type: DataTypes.ENUM('HIGH', 'MODERATE', 'LOW'),
    defaultValue: 'LOW'
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'IN PROGRESS', 'RESOLVED'),
    defaultValue: 'PENDING'
  },
  ai_score_text: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  ai_score_image: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  ai_score_location: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  ai_score_total: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'complaints',
  timestamps: false
});

// Define associations
Complaint.belongsTo(Citizen, { foreignKey: 'citizen_id' });
Citizen.hasMany(Complaint, { foreignKey: 'citizen_id' });

module.exports = Complaint;