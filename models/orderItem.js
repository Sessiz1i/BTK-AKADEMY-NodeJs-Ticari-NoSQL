const sequilize = require("../utility/database")
const Sequelize = require("sequelize")

const OrderItem = sequilize.define("orderItem",{
	id:{
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	quantity:Sequelize.INTEGER,
	price:Sequelize.DOUBLE

})
module.exports = OrderItem
