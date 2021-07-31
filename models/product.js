let dumyProducts = [
	{
		imageUrl: "1.jpg",
		name: "Samsung S1",
		price: 1000,
		description: "Samsung S1 Some quick example text to build on the card title and make."
	},
	{
		imageUrl: "2.jpg",
		name: "Samsung S2",
		price: 2000,
		description: "Samsung S2 Some quick example text to build on the card title and make."
	},
	{
		imageUrl: "3.jpg",
		name: "Samsung S3",
		price: 3000,
		description: "Samsung S3 Some quick example text to build on the card title and make."
	},
	{
		imageUrl: "4.jpg",
		name: "Samsung S4",
		price: 4000,
		description: "Samsung S4 Some quick example text to build on the card title and make."
	},
	{
		imageUrl: "5.jpg",
		name: "Samsung S5",
		price: 5000,
		description: "Samsung S5 Some quick example text to build on the card title and make."
	},
	{
		imageUrl: "6.jpg",
		name: "Samsung S6",
		price: 6000,
		description: "Samsung S6 Some quick example text to build on the card title and make."
	},
	{
		imageUrl: "7.jpg",
		name: "Samsung S7",
		price: 7000,
		description: "Samsung S7 Some quick example text to build on the card title and make."
	},
]
const sequelize = require("../utility/database")
const Sequelize = require("sequelize")

const Product = sequelize.define("product", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	price: {
		type: Sequelize.DOUBLE,
		allowNull: false
	},
	imageUrl: {
		type: Sequelize.STRING,
		allowNull: false
	},
	description: {
		type: Sequelize.STRING,
		allowNull: true
	}
});


// force: true will drop the table if it already exists
Product.sync().then(async () => {
	// Table created
	Product.count().then(count => {
		if (count === 0) {
		Product.bulkCreate(dumyProducts)
		}
	});
})


module.exports = Product
