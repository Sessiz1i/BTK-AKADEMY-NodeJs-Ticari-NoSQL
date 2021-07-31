// Models
const Product = require("../../models/product")
const Category = require("../../models/category");
const User = require("../../models/user")
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {pagination} = require("pagination-express");

// ---------- Index Product ----------
exports.index = async (req, res, next) => {
	const search = req.body.search
	let page, limit, feedBack;
	if (req.query.status) {
		feedBack = {status: req.query.status, name: req.query.name}
	}
	if (req.query.page) {
		page = req.query.page
		limit = req.query.limit
	} else {
		page = 1
		limit = 5
	}
	// Search
	// Query
	const query = {}
	if (search && search !== "") {
		query.where = {name: {[Op.like]: `%${search}%`}}
	}
	query.attributes = ["id", "name", "imageUrl", "price", "description", "categoryId"]
	query.order = [["id", "ASC"]]
	// Option
	const option = {
		searchPath: search,
		req: req,
		page: page,
		limit: limit,
		metatag: "paginationInfo", // Optional for changeing default name of metatag
		lists: "products", // Optional for changeing default name of lists
		range: 5,  // Optional if need paging
	};

	// ---------- resData

	const resData = {
		title: "Product List",
		feedBack: feedBack,
		products: await pagination(Product, option, {...query}),
		categories: await Category.findAll()
	};
	res.render("admin/product/index", resData)

}

// ---------- Form Product ----------
exports.formProduct = async (req, res, next) => {
	const resData = {}
	await Product.findByPk(req.params.id)
	.then(async product => {
		if (product) {
			resData.product = product
			resData.title = "Edit Product"
		} else {
			resData.title = "Add Product"
		}
	}).then(async _ => {
		resData.categories = await Category.findAll()
	}).catch(err => console.log(err))
	res.render("admin/product/form", resData)
}

// ---------- Store Product ----------
exports.store = async (req, res, next) => {
	let status, name
	await Product.findByPk(req.body.id)
	.then(async product => {
		if (product) {
			await product.update({...req.body, userId: req.user.id})
			status = 'update'
			name = product.name
		} else {
			await req.user.createProduct(req.body)
			// await Product.create({...req.body, userId: req.user.id})
			.then(product =>{
				status = 'create'
				name = product.name
			})
		}
		res.redirect(`/admin/products?status=${status}&name=${name}`)
	}).catch(err => console.log(err))
}

// ---------- Delete Product ----------
exports.delete = async (req, res, next) => {
	await Product.destroy({where: {id: req.body.id}})
	.then(product => {
		res.redirect(`/admin/products?status=delete&name=${req.body.name}`);
	})

}
