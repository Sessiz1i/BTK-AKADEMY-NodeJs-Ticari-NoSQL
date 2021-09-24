const express = require("express")
const router = express.Router()
// Controller
const HomeController = require("../controllers/home/HomeController")
const isAuth = require("../middleware/auth");
const csrf = require("../middleware/csrf");

// Route
// Home
router.get('/',                             csrf,HomeController.index)
// Products
router.get('/products',                     csrf,HomeController.products)
router.get('/products/category/:category',  csrf,HomeController.getProductsByCategory)
// Cart
router.get('/cart',                         csrf,isAuth,HomeController.indexCart)
router.post('/cart',                        csrf,isAuth,HomeController.postCart)
router.post('/delete-cartitem',             csrf,isAuth,HomeController.deleteCart)
// Order
router.get('/orders',                       csrf,isAuth,HomeController.indexOrder)
router.post('/create-order',                csrf,isAuth,HomeController.createOrder)


module.exports = router
