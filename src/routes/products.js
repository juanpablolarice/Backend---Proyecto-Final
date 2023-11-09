const express = require('express')
const { Router } = express
const router = new Router()
const { showAllProducts, showProductById, editProduct, updateProduct, createProduct, storeProduct, deleteProduct } = require('./../controllers/productController')
const { sessionActive, isAdmin, isPremium } = require('../middlewares/auth')
// const { authMiddleware, isAdmin } = require('../services/auth.services')
const ProductModel = require('../services/dao/mongo/models/product.model')

router.get('/products', sessionActive, showAllProducts)
router.get('/products/:pid/edit', isAdmin, isPremium, editProduct)
// router.get('/api/product/:id', isAdmin, showProductById)
router.get('/api/product/:pid/edit', isAdmin, editProduct)
router.get('/api/products/create', isAdmin, createProduct)
router.post('/api/product/:pid/update', isAdmin, updateProduct)
router.post('/products/store', isAdmin, storeProduct)
router.delete('/api/products/:pid', isAdmin, deleteProduct)

module.exports = router