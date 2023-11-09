// const ProductDao = require('../../src/services/dao/mongo/models/product.model.js')
const { productClass } = require('../../src/services/factory')
const ProductClass = require('../../src/services/dao/mongo/classes/product.class.js')
const mongoose = require('mongoose')
const chai = require('chai');
const config = require('../../src/config/config')


mongoose.connect(config.DB)
const expect = chai.expect

describe('Testing Products Dao', ()=> {

    before(async function() {        
        this.productId = '652f119b83059a312252e93c'
        this.mockProduct = {
            // "_id": 1,
            "title": "Celular Xiaomi Poco F4 GT 5G 12GB 256GB",
            "description": "VIENE SIN CARGADOR Almacenamiento y RAM: 12 GB + 256 GB LPDDR5 RAM + UFS3.1 Almacenamiento Procesador: Snapdragon® 8 Gen 1 Monitor: 6.67 plano AMOLED DotDisplay Resolución: 2400 × 1080 FHD+ Batería y carga: Batería de 4700 mAh (típica)* Cámara trasera: Cámara triple de 64MP + 8MP + 2MP Sensor de parpadeo Cámara frontal: Cámara frontal de 20MP Seguridad y autenticación: Sensor de huellas dactilares lateral Desbloqueo facial de IA Red y conectividad: Dual SIM: 5G + 5G Redes inalámbricas: Bluetooth 5.2 Wi-Fi 6E (2.4G/5GHz/6GHz) Navegación y posicionamiento: GPS: L1 + L5 | GLONASS: G1 | Galileo: | E1+E5a BeiDou: B1I+B1C+B2a Sensor: Sensor de proximidad | Sensor de luz ambiental de 360° | Sensor de temperatura de color | | de giroscopio | del acelerómetro Brújula electrónica | | de bláster IR Sensor de huellas dactilares | Sensor de parpadeo | Sensor Sar",
            "code": "20050221",
            "price": 1228099,
            "status": true,
            "stock": 9,
            "category": "Celulares",
            "thumbnails": [
                "https://images.fravega.com/f500/fb92edfac6ae7289c726d5b9c43494fa.jpg",
                "https://images.fravega.com/f500/6be43d0d86598245fc57681f09eadce3.jpg"
            ]
        }
    })

    beforeEach( async function(){        
        this.timeout(5000)
        // mongoose.connection.collections.products.drop()
    })

    // test 1
    it('El dao debe devolver los productos en formato de arreglo', async function(){
        // Given        
        let emptyArray = []
        const isArray = true
        
        // Then        
        const result = await productClass.allProducts() 
        
        expect(Array.isArray(result)).to.be.ok
    })

    //  test 2
    it('Se debe crear un producto', async function(){        
        // Given
        const [ message, status ] = await productClass.storeProduct(this.mockProduct);
        
        expect(status).is.equal("success")        
    })

    //  test 3
    it('El dao debe devolver el producto seleccionado por ID', async function(){
        // Given        
        let emptyArray = []
        const isArray = true
        
        // Then        
        const result = await productClass.getProductById(this.productId) 
        
        expect(result).to.be.ok
    })
})
