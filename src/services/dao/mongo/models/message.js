const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    products:{
        id:{
            required:true
        },
        quantity:{
            type:Number,
            required:true
        }
    }
}) 

const Message = mongoose.model('message', MessageSchema)

module.exports = Message