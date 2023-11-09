const express = require('express')
const { Router } = express
const router = new Router()
const {generateProduct} = require('../utils/generateProduct')

router.get('/mockingproducts', async (req, res) => {
    let products = []
    for(i=0; i<100; i++){
        const prod = await generateProduct()
        products.push(prod)
    }
    res.send(products)
})

module.exports = router