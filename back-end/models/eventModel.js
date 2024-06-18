const { DataTypes } = require('sequelize');
const sequelize = require('../configs/dbConfig')

const Event = sequelize.define('Event', {
    event_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    event_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    event_venue: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    event_start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: sequelize.NOW
    },
    event_end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    event_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    event_price: {
        type: DataTypes.FLOAT(7, 2),
        allowNull: false,
    },
    event_capacity: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
    }
}, {
    tableName: 'events',
    timestamps: false,
});


// sequelize.sync()
//     .then(() => {
//         console.log("Event table has been created if it doesn't exist.");
//     })
//     .catch(error => {
//         console.error('Error creating Event table:', error);
//     });

// Event.sync({ alter: true })
//     .then(() => {
//         console.log("Event table synchronized successfully.");
//     })
//     .catch(err => {
//         console.error("Error synchronizing Event table:", err);
//     });


module.exports = Event;