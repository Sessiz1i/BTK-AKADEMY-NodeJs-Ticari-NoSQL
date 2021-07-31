const sequilize = require("../utility/database")
const Sequelize = require("sequelize")

const CartItem = sequilize.define("cartItem",{
	id:{
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	quantity:Sequelize.INTEGER
})
module.exports = CartItem
