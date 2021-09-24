let dumyCategory = [
    {
        "name": "Telefon",
        "description": "Telefon Kategorisi"
    },
    {
        "name": "Televizyon",
        "description": "Televizyon Kategorisi"
    },
    {
        "name": "Bilgisayar",
        "description": "Bilgisayar Kategorisi"
    },
    {
        "name": "Elektonik",
        "description": "Elektonik Kategorisi"
    },

]
const {Schema, model} = require("mongoose");

const categorySchema = new Schema({
    name: {
        type: String,
        index:true,
        unique:true,
        trim:true,
        required: [true, "Lütfen bu alanı doldurunuz"],
        minlength: [5, "Bu alan en az {MINLENGTH} karakter olmalıdır"],
        maxlength: [50, "Bu alan en fazla {MAXLENGTH} karakter olmalıdır"]
    },
    description: {
        type: String,
        required: [true, "Lütfen bu alanı doldurunuz"],
        minlength: [5, "Bu alan en az {MINLENGTH} karakter olmalıdır"],
        maxlength: [100, "Bu alan en fazla {MAXLENGTH} karakter olmalıdır"]
    }
},{timestamps: true})

module.exports = model("Category", categorySchema)
