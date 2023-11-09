const express = require('express')
const { Router } = express
const router = new Router()
const { sessionActive, isAdmin, isUser, userForCart } = require ('../middlewares/auth')
const { getAll, getUserById, deleteUsers } = require ('../controllers/userController.js')
// const { getCartById, getMyCart } = require ('../controllers/cartController')
// const { showAllProducts } = require ('../controllers/productController')

router.get('/api/users', isAdmin, getAll)

router.delete('/api/users/delete', isAdmin, deleteUsers)

router.post('/api/users/:id', isAdmin, getUserById)

router.get('/chat', isUser, async (req, res) => {
    res.render('chat')
})

module.exports = router
