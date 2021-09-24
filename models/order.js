const {Schema, model} = require("mongoose")

const orderSchema = Schema({
    user: {
        _id: {
            type:Schema.Types.ObjectId,
            required: [true,"Bu alanı gereklidir."],
            ref: "User"
        },
        name: {
            type: [String, "Geçerli bir değer giriniz"],
            required: [true,"Bu alanı gereklidir."],
        },
        email: {
            type: String,
            required: true
        },
    },
    items: [
        {
            product: {
                type: Object,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
})
module.exports = model("Order",orderSchema)