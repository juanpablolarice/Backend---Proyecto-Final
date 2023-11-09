const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')
const productsCollection = 'products'

const ProductSchema = new mongoose.Schema({
    title:{
        type:String,
        unique:true,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    code:{
        type:String,
        unique:true,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    status:{
        type:Boolean,
        required:true,
    },
    stock:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true,
        enum:['Televisores', 'Celulares', 'Notebooks']
    },
    thumbnails:[{
        type:String
    }]
})

ProductSchema.plugin(paginate)
const Product = mongoose.model('product', ProductSchema)
// const Product = mongoose.model(productsCollection, ProductSchema)

module.exports = Product
