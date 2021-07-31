// Express ve body-parser ile server dinleme
const express = require("express")
const app = express();
const bodyParser = require("body-parser")
const path = require("path")
const $ = require("jquery");
// Imports
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, "./public")))
app.set("view engine", "pug")
app.set("views", "./views")


// Modeller
const sequelize = require("./utility/database")
const Category = require("./models/category")
const Product = require("./models/product")
const User = require("./models/user")
const Cart = require("./models/cart")
const CartItem = require("./models/cartItem")
const Order = require("./models/order")
const OrderItem = require("./models/orderItem")

// ORM Relationship - İlişki Tanımları
// Product & Category
Product.belongsTo(Category,{foreignKey:{allowNull:false,defaultValue:1}})
Category.hasMany(Product)
// Product & User
Product.belongsTo(User,{foreignKey:{allowNull:false,defaultValue:1}})
User.hasMany(Product)
// User & Cart
User.hasOne(Cart)
Cart.belongsTo(User)
// Cart & CartItem
Cart.belongsToMany(Product,{through:CartItem})
Product.belongsToMany(Cart,{through:CartItem})
// Cart & CartItem
Order.belongsToMany(Product,{through:OrderItem})
Product.belongsToMany(Order,{through:OrderItem})
// Order & User
Order.belongsTo(User)
User.hasMany(Order)


//Routing importları
const adminRoutes = require("./routes/AdminRouters")
const homeRoutes = require("./routes/HomeRouters")

app.use((req,res,next) => {
	User.findByPk(1)
	.then(user =>{
		req.user = user
		next();
	})
	.catch(err => console.log(err))
})

// Routes
app.use("/admin", adminRoutes)
app.use("/", homeRoutes)


//Test the connection
sequelize
//.sync({force: true})
.sync()
.catch(err => console.error(err))


// 404 Sayfasına yönlenme
const ErrorsController = require("./controllers/error/ErrorController")
app.use(ErrorsController.get404Page)

app.listen(3000, () => console.log("3000 Portundan server dinleniyor."))
