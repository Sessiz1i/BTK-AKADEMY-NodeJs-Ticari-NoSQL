const Category = require("../../models/category");
const Product = require("../../models/product");
const assert = require("assert");
const {validOptions} = require("mongodb/lib/operations/connect");
const {handleCallback} = require("mongodb/lib/utils");

// ---------- Index Categories ----------
exports.index = async (req, res, next) => {
    const resData = {};
    if (req.query.n) {
        resData.feedBack = {status: req.query.s, name: req.query.n}
    }
    resData.title = "Category List"
    resData.categories = await Category.find()
    res.render("admin/category/index", resData)
}
// ---------- Form Product ----------
exports.form = async (req, res, next) => {
    const resData = {};
    if (req.params.id) {
        resData.title = "Edit Category"
        resData.category = await Category.findById(req.params.id)
    } else if (!req.params.id) {
        resData.title = "Add Category"
    }
    res.render("admin/category/form", resData)
}

// ---------- Store Product ----------
exports.store = async (req, res, next) => {
    let query;
    if (req.body.id) {
        delete req.body._csrf
        Category.findByIdAndUpdate(req.body.id, req.body, {runValidators: true})
            .then(result => {
                query = `?s=update&n=${result.name}`
                res.redirect(`/admin/categories${query}`)
            }).catch(err => {

            const errors = {};
            if (err?.name === "ValidationError") {
                Object.values(err.errors).forEach(({properties}) => {
                    errors[properties.path] = properties.message
                })
            }
            // TODO unique veri validate
            else if (err.name === "MongoError" && err.code === 11000) {
                errors[Object.keys(err.keyValue)] = `Daha önce kayır edilmiş veri`
            }
            // unique veri validate end
            const resData = {title: "Edit Category", errors: errors, old: req.body}
            res.render("admin/category/form", resData)
        })
    } else if (!req.body.id) {
        console.log("id yoksa")
        const newCategory = new Category({
            name: req.body.name,
            description: req.body.description
        })
        newCategory.save().then(result => {
            console.info("Burada", result)
            if (result) {
                query = `?s=create&n=${req.body.name}`
                res.redirect(`/admin/categories${query}`)
            }
        }).catch(err => {
            let errors = {};
            if (err.name === "ValidationError") {
                Object.values(err.errors).forEach(({properties}) => {
                    errors[properties.path] = properties.message
                })
            } else if (err.name === "MongoError" && err.code === 11000) {
                errors[Object.keys(err.keyValue)] = `Daha önce kayır edilmiş veri`
            }
            delete req.body._csrf
            const resData = {title: "Add Category", errors: errors,old : req.body}
            console.log(resData)
            res.render("admin/category/form", resData)
        })
    }
}
// ---------- Delete Product ----------
exports.delete = async (req, res, next) => {
    await Category.findByIdAndDelete(req.body.id)
    let query = `?s=delete&n=${req.body.name}`
    res.redirect(`/admin/categories${query}`)
}

