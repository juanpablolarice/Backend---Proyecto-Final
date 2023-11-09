const express = require('express')
const { Router } = express
const router = new Router()

const { sessionActive, isAdmin, isUser, userForCart } = require ('../middlewares/auth')
const { getAll, getCartById, getMyCart, createCart, updateProductQuantity, deleteCart, deleteProductFromCart, purchase } = require('./../controllers/cartController')

router.get('/cart', sessionActive, getMyCart)
router.get('/api/carts', isAdmin, getAll)
router.get('/api/carts/:cid', isAdmin, getCartById)
router.get('/cart/:cid/purchase', isUser, purchase)

router.post('/api/carts', isAdmin, createCart)
// router.post('/api/carts/getTotal/:cid', getTotal)

// ACTUALIZO LA CANTIDAD DE PRODUCTOS :PID EN EL CARRO :CID
router.put('/api/carts/:cid/product/:pid', sessionActive, updateProductQuantity)

// ACTUALIZO EL CARRO CON EL ARREGLO DE PRODUCTOS INGRESADO
// router.delete('/api/carts/:cid', isAdmin, deleteCart)
router.delete('/api/carts/:cid/product/:pid', sessionActive, deleteProductFromCart)

module.exports = router
