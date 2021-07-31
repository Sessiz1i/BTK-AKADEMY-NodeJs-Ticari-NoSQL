const express = require("express")
const router = express.Router()
// Controllers
const ProductController = require("../controllers/admin/ProductController")



router.get('/products',			ProductController.index)
router.post('/products',			ProductController.index)

router.get('/form-product/:id?', 	ProductController.formProduct)

router.post(`/add-product`, 		ProductController.store)

router.post(`/delete-product`, 	ProductController.delete)

module.exports = router;

