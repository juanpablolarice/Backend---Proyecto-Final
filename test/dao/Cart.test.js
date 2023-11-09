// const CartDao = require('../../src/services/dao/mongo/models/cart.model.js')
const { cartClass } = require('../../src/services/factory')
const mongoose = require('mongoose')
const chai = require('chai');
const config = require('../../src/config/config')

mongoose.connect(config.DB)
const expect = chai.expect

describe('Testing Carts Dao', ()=> {

    before(function() {
        this.cartId = '64c0b3d47fc7cce121a8837f'
        // this.mockCart = new cartClass()
    })

    beforeEach(function(){
        this.timeout(5000)
        // mongoose.connection.collections.carts.drop()
    })

    // test 1
    it('El dao debe devolver los carros en formato de arreglo', async function(){
        // Given        
        const isArray = true

        // Then
        const result = await cartClass.getAll()

        expect(Array.isArray(result)).to.be.ok        
    })

    // test 2
    it('El dao debe devolver el carro seleccionado por ID', async function(){
        // Given
        const isArray = true

        // Then
        const result = await cartClass.getCartById(this.cartId)

        expect(result).to.be.ok        
    })
})
