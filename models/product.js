let dumyProducts = [
    {
        "imageUrl": "1.jpg",
        "name": "Samsung S1",
        "price": 1000,
        "description": "Samsung S1 Some quick example text to build on the card title and make."
    },
    {
        "imageUrl": "2.jpg",
        "name": "Samsung S2",
        "price": 2000,
        "description": "Samsung S2 Some quick example text to build on the card title and make."
    },
    {
        "imageUrl": "3.jpg",
        "name": "Samsung S3",
        "price": 3000,
        "description": "Samsung S3 Some quick example text to build on the card title and make."
    },
    {
        "imageUrl": "4.jpg",
        "name": "Samsung S4",
        "price": 4000,
        "description": "Samsung S4 Some quick example text to build on the card title and make."
    },
    {
        "imageUrl": "5.jpg",
        "name": "Samsung S5",
        "price": 5000,
        "description": "Samsung S5 Some quick example text to build on the card title and make."
    },
    {
        "imageUrl": "6.jpg",
        "name": "Samsung S6",
        "price": 6000,
        "description": "Samsung S6 Some quick example text to build on the card title and make."
    },
    {
        "imageUrl": "7.jpg",
        "name": "Samsung S7",
        "price": 7000,
        "description": "Samsung S7 Some quick example text to build on the card title and make."
    },
]
const {Schema, model} = require("mongoose");
const {isMimeType} = require("validator");

const productSchema = new Schema({
    image: {
        type: String,
        required: [true, "Lütfen bu alanı doldurun"],
    },
    name: {
        type: String,
        required: [true, "Lütfen bu alanı doldurun"],
        minlength: [5, `Bu alan en az {MINLENGTH} karakter olmalıdır`],
        maxlength: [10, `Bu alan en fazla {MAXLENGTH} karakter olmalıdır`],
    },
    price: {
        type: Number,
        required: [function () {
            return this.isActive
        }, "Lütfen bu alanı doldurun"],
        min: [1, `Bu alan en az {MIN} olmalıdır`],
        max: [10000, `Bu alan en fazla {MAX} olmalıdır`],
        // TODO MODELDE get VE set KULANIMI
        get: value => Math.round(value), // 10.2 => 10 çıktı
        set: value => Math.round(value)  // 10.6 => 11 çıktı
    },
    description: {
        type: String,
        maxlength: [100, `Bu alan en fazla {MAXLENGTH} karakter olmalıdır`],
    },
    date: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    tags: {
        type: Array,
        validate: {
            validator: function (value) {
                return value && value.length > 0
            },
            message: "En az bir Etiket eklemelisiniz"
        }
    },
    categories: {
        type: [{type: Schema.Types.ObjectId}],
        ref: "Category",
        validate: {
            validator: function (value) {
                return value && value.length > 0
            },
            message: "En az 1 seçim yapmalısınız"
        }
    },
    isActive: {
        type: Boolean,
        default: false
    },
});

module.exports = model("Product", productSchema)
