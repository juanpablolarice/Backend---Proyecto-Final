const Cart = require('./../dao/mongo/models/cart.model')

const getAll = async (req, res) => {
    console.log("Entro al service cart")
    try {
        //         // carts = await Cart.find({}).populate('products.product');
        const carts = await Cart.find().populate('products.product')
        res.status(200).send(carts)
    } catch (error) {
        res.status(404).send(error)
    }
}

module.exports = { getAll }
