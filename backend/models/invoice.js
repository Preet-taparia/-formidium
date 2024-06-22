// backend/models/Invoice.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  recipientAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cryptocurrency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  companyEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  invoiceCategory: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Invoice;
