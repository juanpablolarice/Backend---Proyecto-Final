const chai = require('chai');
const supertest = require ('supertest');
const config = require('../src/config/config')


const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Testing Products', () => {    
    describe('Testing Products Api', () => {
        // FALTA UTILIZAR PASSPORT PARA PODER REALIZAR EL TEST CON UNA SESSION ACTIVA DE ADMINISTRADOR
        // Test 01
        it('Crear producto: EL API POST /products/store debe crear un nuevo producto correctamente', async () => {
            // Given
            const productMock = {
                title: "Producto",
                description: "Descripción del producto",
                code: "111",
                price: 10,
                status: true,
                stock: 1,
                category: "Televisores",
                thumbnails: [
                    "https://placehold.co/600x400/000000/FFF?text=Producto+1",
                    "https://placehold.co/600x400/EEEEEE/000?text=Producto+1"
                ]
            }
            
            // Then
            // const {statusCode, ok, _body} 
            const result = (await requester.post('/products/store').send(productMock))
            console.log(result)

            // Assert
            expect(result).to.be.ok          
        })
    })
})
