const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')
const usersCollection = 'users'

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "cart"
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        default:'User',
        enum:['Admin', 'Premium', 'User']
    },
    last_login: {
        type: Date,
        default: ''
    },
})

UserSchema.plugin(paginate)
// const Product = mongoose.model('product', ProductSchema)
const User = mongoose.model(usersCollection, UserSchema)

module.exports = User
