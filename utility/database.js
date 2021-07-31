const Sequelize = require('sequelize');
const sequelize = new Sequelize('node-app', 'root', '123456', {
	host: 'localhost',dialect:'mysql'
});

module.exports = sequelize


