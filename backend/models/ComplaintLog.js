// Complaint Log Model
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Complaint = require('./Complaint');

const ComplaintLog = sequelize.define('ComplaintLog', {
  log_id: {
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
  action_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  old_value: {
    type: DataTypes.TEXT
  },
  new_value: {
    type: DataTypes.TEXT
  },
  action_timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'complaint_logs',
  timestamps: false
});

// Define associations
ComplaintLog.belongsTo(Complaint, { foreignKey: 'complaint_id' });
Complaint.hasMany(ComplaintLog, { foreignKey: 'complaint_id' });

module.exports = ComplaintLog;