const { DataTypes } = require('sequelize');
const sequelize = require('../configs/dbConfig');

const User = sequelize.define('User', {
    u_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    u_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    u_email: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    u_password: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    contact_no: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    profile_pic: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    user_type: {
        type: DataTypes.STRING(5),
        allowNull: false,
        defaultValue: 'user'
    }
}, {
    tableName: 'users',
    timestamps: false
});

sequelize.sync()
    .then(() => {
        console.log("User table has been created if it doesn't exist.");
    })
    .catch(error => {
        console.error('Error creating User table:', error);
    });

module.exports = User;
