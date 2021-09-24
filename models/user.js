const dumyUser = {name: "Admin", email: "admin@admin.com", password: "123456"}


const mongoose = require("mongoose")
const Product = require("./product");
const {TokenExpiredError} = require("jsonwebtoken");
const {isEmail} = require("validator");
const {Schema} = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Geçerli bir `{VALUE}` giriniz']
    },
    email: {
        type: String,
        unique: true,
        index: true,
        lowercase: true,
        validate: [isEmail,"Geçerli bir {VALUE} giriniz"]
    },
    password:{
        type:String,
        required: [true,"Geçerli bir {VALUE} giriniz"]
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    token:{
        resetToken:String,
        resetTokenExpiration:Date,
    },
    cart: {
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
})
userSchema.methods.getCart = async function () {
    const ids = this.cart.items.map(i => i.product)
    return Product.find({_id: {$in: ids}})
        .select("name price imageUrl")
        .then(products => {
            return products.map(product => {
                return {
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    quantity: this.cart.items.find(item => {
                        return item.product.toString() === product._id.toString()
                    }).quantity
                }
            })
        })
}

userSchema.methods.addToCart = function (product) {
    const index = this.cart.items.findIndex(cartProduct => {
        return cartProduct.product.toString() === product._id.toString()
    })
    const updatedCartItem = [...this.cart.items]
    let itemQuantity = 1
    if (index >= 0) {
        // Cart Zaten Eklenmek İstenen Product Var: Quantity'i Arttır.
        itemQuantity = this.cart.items[index].quantity + 1
        updatedCartItem[index].quantity = itemQuantity
    } else {
        // updatedCartItem'a yeni bir eleman ekle
        updatedCartItem.push({
            product: product._id,
            quantity: itemQuantity
        })
    }
    this.cart = {
        items: updatedCartItem
    }
    return this.save()
}
userSchema.methods.clearCart = function () {
    this.cart = {items: []}
    return this.save()
}
// DELETE
userSchema.methods.deleteCartItem = function (product) {
    const cartItem = this.cart.items.filter(item => {
        if (item._id.toString() !== product.toString()) {
            return item
        } else if (item._id.toString() === product.toString() && item.quantity > 1) {
            item.quantity -= 1
            return item
        }
    })
    this.cart.items = cartItem
    return this.save()
}
module.exports = mongoose.model("User", userSchema);
