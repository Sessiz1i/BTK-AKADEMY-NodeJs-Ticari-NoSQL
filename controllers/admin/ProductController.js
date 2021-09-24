// Models
const Product = require("../../models/product")
const Category = require("../../models/category");
const mongoose = require("mongoose");
// ---------- Index Product ----------
exports.index = async (req, res, next) => {
    const resData = {};
    if (req.query.n) {
        resData.feedBack = {status: req.query.s, name: req.query.n}
    }
    resData.title = "Product List"
    resData.products = await Product.find({user: req.user._id})
    // .find({price:{$eq:2000}}) 		// eq (equal) = Eşit
    // .find({price:{$ne:2000}}) 		// ne (not equal) != Eşit değil
    // .find({price:{$gt:2000}}) 		// gt (greater than) > Büyükse
    // .find({price:{$gte:2000}}) 		// gte (greater than or equal) >= Büyük veya eşitse
    // .find({price:{$lt:2000}}) 		// lt (less than) < Küçükse
    // .find({price:{$lte:2000}}) 		// lte (less than or equal) <= Küçük veya eşitse
    // .find({price:{$in:[1000,3000}}) 	// in  Varsa
    // .find({price:{$nin:2000}}) 		// nin  Yoksa
    // .find({price: {$gte: 1000, $lte: 3000}}) // 1000 den büyük 3000 den küçük
    // .find().or([{price: {$gt:2000},name:"Samsung S6"}]) // or Veya
    // .find().and([{price: {$gt:2000},name:"Samsung S6"}]) // and Ve
    // Search
    // .find({name: /^Samsung/}) 		// Samsung ile başlasın
    // .find({name:/Samsung$/})		// Samsung ile Bitsin
    // .find({name:/.*Samsung.*/})	// Samsung içinde geçen
    res.render("admin/product/index", resData)
}

// ---------- Form Product ----------
exports.form = async (req, res, next) => {
    const resData = {categories: await Category.find()};
    if (req.params.id) {
        resData.title = "Edit Product"
        resData.product = await Product.findOne({_id: req.params.id, user: req.user._id})
    } else if (!req.params.id) {
        resData.title = "Add Product"
    }
    res.render("admin/product/form", resData)

}

// ---------- Store Product ----------
exports.store = (req, res, next) => {
    delete req.body._csrf
    let query;
    if (req.body.id) {
        Product.findByIdAndUpdate(req.body.id, req.body)
            .then((result) => {
                query = `?s=update&n=${result.name}`
                res.redirect(`/admin/products${query}`)
            })
            .catch(err => console.error(err))
    } else if (!req.body.id) {
        Product.create({
            ...req.body,
            user: req.user,
            isActive: true,
            tags: "telefon"
        }).then(() => {
            query = `?s=create&n=${req.body.name}`
            res.redirect(`/admin/products${query}`)
        }).catch(async err => {
            const errors = {}
            // TODO resData ya hataları doldur
            if (err.name === "ValidationError") {
                for (const [index, error] of Object.entries(err.errors)) {
                    errors[index] = {message: error.message}
                }
                const resData = {categories: await Category.find()};
                resData.title = "Add Product"
                resData.errors = errors
                resData.old = req.body
                res.render("admin/product/form", resData)
            } else {
                next(err)
            }
        })
    }
}

// ---------- Delete Product ----------
exports.delete = (req, res, next) => {
    Product.deleteOne({_id: req.body._id, user: req.user._id})
        .then(result => {
            if (result.deletedCount === 0) {
                return res.redirect("/")
            } else {
                let query = `?s=delete&n=${req.body.name}`
                res.redirect(`/admin/products${query}`)
            }
        })
}
