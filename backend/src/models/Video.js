const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Video = sequelize.define(
    'Video',
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        uploadedById: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true
        },
        activity: {
            type: DataTypes.ENUM('paragliding', 'diving', 'other'),
            allowNull: false,
            defaultValue: 'other'
        },
        capturedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        originalName: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        storedName: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        mimeType: {
            type: DataTypes.STRING(120),
            allowNull: false
        },
        sizeBytes: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        tableName: 'videos',
        timestamps: true
    }
);

module.exports = Video;
