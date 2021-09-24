const express = require("express")
const router = express.Router()
const isAuth = require("../middleware/auth")
const isAdmin =require("../middleware/isAdmin")
// Controllers
const ProductController = require("../controllers/admin/ProductController")
const CategoryController = require("../controllers/admin/CategoryController")
const csrf = require("../middleware/csrf");
const path = require("path");


// Product Route
router.get('/products',			csrf,isAuth,isAdmin,ProductController.index)
router.post('/products',           csrf,isAuth,isAdmin,ProductController.index)
router.get('/form-product/:id?', 	csrf,isAuth,isAdmin,ProductController.form)
router.post(`/add-product`, 		csrf,isAuth,isAdmin,ProductController.store)
router.post(`/delete-product`, 	csrf,isAuth,isAdmin,ProductController.delete)

// Category Route
router.get('/categories',			csrf,isAuth,isAdmin,CategoryController.index)
router.get('/form-category/:id?', 	csrf,isAuth,isAdmin,CategoryController.form)
router.post(`/add-category`, 		csrf,isAuth,isAdmin,CategoryController.store)
router.post(`/delete-category`, 	csrf,isAuth,isAdmin,CategoryController.delete)

module.exports = router;

