const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Verification = sequelize.define('Verification', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    otpHash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('register', 'reset'),
        allowNull: false,
        defaultValue: 'register'
    }
}, {
    tableName: 'verifications',
    timestamps: true
});

module.exports = Verification;