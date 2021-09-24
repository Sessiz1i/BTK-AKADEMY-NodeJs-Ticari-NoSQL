// Model

const Product = require("../../models/product")
const Category = require("../../models/category")
const User = require("../../models/user")
const Order = require("../../models/order")

// Products Controller
exports.index = async (req, res, next) => {
    const resData =
        {
            title: "Ahsent Shopping",
            products: await Product.find(),
            categories: await Category.find()
        }

    res.render("home/index", resData);
}

exports.products = async (req, res, next) => {
    const resData =
        {
            title: "Products",
            products: await Product.find(),
            categories: await Category.find()
        }
    res.render("home/products", resData)
}

exports.getProductsByCategory = async (req, res, next) => {
    const resData = {}
    resData.categories = await Category.find()
    resData.category = resData.categories.find(i => i.name.replace(" ", "-").toLowerCase() === req.params.category)
    resData.title = resData.category.name
    resData.products = await Product.find({categories: resData.category._id})

    res.render("home/products", resData);
}

// Cart Controller
exports.indexCart = async (req, res, next) => {
    const resData = {}
    resData.title = "Cart"
    req.user.populate("cart.items.product", "name price imageUrl")
        .execPopulate()
        .then(user => {
            resData.products = user.cart.items
            res.render("home/cart", resData)
        })


}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product)
        })
        .then(() => {
            res.redirect("/cart")
        })
        .catch(err => console.error(err))
}

exports.deleteCart = (req, res, next) => {
    req.user.deleteCartItem(req.body.productId)
    res.redirect("/cart")
}

//Order Controller
exports.indexOrder = async (req, res, next) => {
    const resData = {
        title: "Orders",
        orders: await Order.find({"user._id":req.user._id})
    }
    res.render('home/orders', resData)
}
exports.createOrder = async (req, res, next) => {
    const resData = {}
    resData.title = "Order"

    req.user.populate("cart.items.product", "_id name price imageUrl")
        .execPopulate()
        .then(user => {
            const newOrder = new Order({
                user: req.user,
                items: user.cart.items
            })
            return newOrder.save()
        })
        .then(() => {
            return req.user.clearCart()
        })
        .then(() => {
            res.redirect("/orders")
        })
        .catch(err => console.error(err))
}

