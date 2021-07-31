let dumyCategory = [
	{
		name: "Telefon",
		description: "Telefon Kategorisi"
	},
	{
		name: "Televizyon",
		description: "Televizyon Kategorisi"
	},
	{
		name: "Bilgisayar",
		description: "Bilgisayar Kategorisi"
	},
	{
		name: "Elektonik",
		description: "Elektonik Kategorisi"
	},

]
const sequelize = require("../utility/database")
const Sequelize = require("sequelize")

const Category = sequelize.define("category", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	description: {
		type: Sequelize.STRING,
		allowNull: true,
	},
})


// force: true will drop the table if it already exists
Category.sync().then(() => {
	// Table created
	Category.count().then(async count => {
		if (count === 0) {
			return await Category.bulkCreate(dumyCategory);
		}
	})
})



module.exports = Category
