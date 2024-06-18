const sequelize = require('./dbConfig');
const Event = require('../models/eventModel');
const User = require('../models/userModel');

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        await User.sync({ alter: true });
        console.log('User table has been synchronized successfully.');

        await Event.sync({ alter: true });
        console.log('Event table has been synchronized successfully.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
})();
