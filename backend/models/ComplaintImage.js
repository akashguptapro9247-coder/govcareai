// Complaint Image Model
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Complaint = require('./Complaint');

const ComplaintImage = sequelize.define('ComplaintImage', {
  image_id: {
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
  image_path: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'complaint_images',
  timestamps: false
});

// Define associations
ComplaintImage.belongsTo(Complaint, { foreignKey: 'complaint_id' });
Complaint.hasMany(ComplaintImage, { foreignKey: 'complaint_id' });

module.exports = ComplaintImage;