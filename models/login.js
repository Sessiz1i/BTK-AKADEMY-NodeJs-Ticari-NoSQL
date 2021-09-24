const {Schema, model} = require("mongoose");
const {isEmail} = require("validator");
const dumyUser = {name: "Admin", email: "admin@admin.com", password: "123456"}


const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        index: true,
        lowercase: true,
        required:[true,"Bu alan gereklidir"],
        validate: [isEmail,"Geçerli bir değer giriniz."]
    },
    password:{
        type:String,
        required: [true,"Bu alan gereklidir"]
    },
})

module.exports = model("User", userSchema);
