const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    products:{
        type:[
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "product"
                },
                quantity:{
                    type:Number,
                    required:true,
                    default:1
                }
            }
        ]
    }
})

const Cart = mongoose.model('cart', CartSchema)

module.exports = Cart
