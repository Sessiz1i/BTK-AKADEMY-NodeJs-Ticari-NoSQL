const express = require("express")
const router = express.Router()
// Controller
const HomeController = require("../controllers/home/HomeController")

// Route
// Home
router.get('/', HomeController.index)
// Products
router.get('/products', HomeController.products)
router.get('/products/category/:category', HomeController.getProductsByCategory)
// Cart
router.get('/cart', HomeController.cartIndex)
router.post('/cart', HomeController.postCart)
router.post('/delete-cartitem', HomeController.deleteCart)
// Order
router.get('/orders', HomeController.indexOrder)
router.post('/create-order', HomeController.createOrder)


module.exports = router
