const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 

const User = sequelize.define('User', {
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('annotator', 'admin'),
    defaultValue: 'annotator'
  }
});

module.exports = User;