const dumyUser = {name: "Admin", email: "admin@admin.com", password: "123456"}
const sequelize = require("../utility/database")
const Sequelize = require("sequelize")



const User = sequelize.define("user",{
	id:{
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		unqueued: true,
	},
	password:{
		type: Sequelize.STRING,
		allowNull: false,
		minLength: 6,
	}
})
let _user
// force: true will drop the table if it already exists
User.sync().then(() => {
	// Table created
	User.findByPk(1)
	.then(user =>{
		if (!user){
		  return User.create(dumyUser);
		}
		return user
	}).then(user =>{
		_user = user
		return user.getCart()
	}).then(cart =>{
		if (!cart){
			return _user.createCart()
		}
		return cart
	}).catch(err => console.log(err))
})

module.exports = User
