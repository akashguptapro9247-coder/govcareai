// Complaint Message Model
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Complaint = require('./Complaint');

const ComplaintMessage = sequelize.define('ComplaintMessage', {
  message_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  complaint_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Complaint,
      key: 'complaint_id'
    }
  },
  sender_type: {
    type: DataTypes.ENUM('ADMIN', 'CITIZEN'),
    allowNull: false
  },
  message_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'complaint_messages',
  timestamps: false
});

// Define associations
ComplaintMessage.belongsTo(Complaint, { foreignKey: 'complaint_id' });
Complaint.hasMany(ComplaintMessage, { foreignKey: 'complaint_id' });

module.exports = ComplaintMessage;