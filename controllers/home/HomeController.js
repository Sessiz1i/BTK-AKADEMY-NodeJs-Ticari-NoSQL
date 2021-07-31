// Model

const Product = require("../../models/product")
const Category = require("../../models/category")
const CartItem = require("../../models/cartItem")

// Products Controller
exports.index = async (req, res, next) => {
	const resData = {
		title: "Ahsent Shopping",
		products: await Product.findAll({attributes: ["id", "name", "imageUrl", "price", "description"]}),
		categories: await Category.findAll({attributes: ["id", "name", "description"]})
	}
	res.render("home/index", resData);
}

exports.products = (req, res, next) => {
	const resData = {title: "Products"}
	Category.findAll({attributes: ["id", "name", "description"]})
	.then(categories => {
		resData.categories = categories
	}).then(async _ => {
		await Product.findAll({attributes: ["id", "name", "imageUrl", "price", "description"]})
		.then(products => {
			resData.products = products
		}).catch(err => console.error("Product", err))

		res.render("home/products", resData)
	}).catch(err => console.error("Product", err))

}

exports.getProductsByCategory = (req, res, next) => {
	Category.findAll({attributes: ["id", "name", "description"]})
	.then(async categories => {
		const selectCategory = categories.find(i => i.name.replaceAll(" ", "-").toLowerCase() === req.params.category)
		const resData = {
			title: selectCategory.name,
			categories: categories,
			products: await selectCategory.getProducts() // getProducts() Sequelize nin otomatik functionu
		}
		res.render("home/products", resData);
	}).catch(err => console.log(err))
}

// Cart Controller
exports.cartIndex = async (req, res, next) => {
	const resData = {
		title: "Cart",
		categories: await Category.findAll()
	}
	req.user.getCart()
	.then(cart => {
		return cart.getProducts()
	})
	.then(async products => {
		resData.products = products
		res.render("home/cart", resData)
	})
	.catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
	let userCart, quantity = 1
	req.user.getCart()
	.then(cart => {
		userCart = cart
		return cart.getProducts({where: {id: req.body.productId}})
	})
	.then(products => {
		if (products.length > 0) {
			quantity += products[0].cartItem.quantity
			return products[0]
		}
		return Product.findByPk(req.body.productId)
	})
	.then(product => {
		userCart.addProduct(product, {through: {quantity}})
		res.redirect("/cart")
	})
	.catch(err => console.log(err))
}

exports.deleteCart = (req, res, next) => {
	req.user.getCart()
	.then(cart => {
		return cart.getProducts({where: {id: req.body.productId}})
	})
	.then((product) => {
		product[0].cartItem.destroy()
		res.redirect("/cart")
	})
	.catch(err => console.error(err))
}

//Order Controller
exports.indexOrder = async (req, res, next) => {
	const resData = {
		title: "Orders",
		categories: await Category.findAll()
	}
	req.user
	.getOrders({include:["products"]})
	.then(orders => {
		resData.orders = orders
		console.log(resData)
		res.render('home/orders',resData)
	})
	.catch(err => console.error(err))
}
exports.createOrder = async (req, res, next) => {
	let userCart
	req.user.getCart()
	.then(cart => {
		userCart = cart
		return cart.getProducts()
	})
	.then(products => {
		req.user.createOrder()
		.then(order => {
			return order.addProduct(products.map(product => {
				product.orderItem = {
					quantity: product.cartItem.quantity,
					price: product.price
				}
				return product
			}))
		})
		.then(_ => {
			userCart.setProducts(null)
		})
		.then(_ => {
			res.redirect("/orders")
		})
		.catch(err => console.error(err))
	})

}


