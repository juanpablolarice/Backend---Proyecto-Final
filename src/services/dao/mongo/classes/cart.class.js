const { deleteProductFromCart } = require('../../../../controllers/cartController')
const cartModel = require('../models/cart.model')
const productModel = require('../models/product.model')
const productClass = require('./product.class')
const ticketClass = require('./ticket.class')

class Cart {    
    constructor(){
        this.data = []
    }

    allProducts = async (category, status, limit, sort, page) => {
        let dataProducts = ''
        try {
            if (category && status) {
                dataProducts = await productModel.paginate({ $or: [{ category: category }, { status: status || true }] }, {
                    limit:limit || 10,
                    sort: { price: sort || 'asc' },
                    page: page || 1
                })
                console.log("Entro al 1")
            } else if (category) {
                dataProducts = await productModel.paginate({ category: category }, {
                    limit:limit || 10,
                    sort: { price: sort || 'asc' },
                    page: page || 1
                })
                console.log("Entro al 2")
            } else if (status) {
                dataProducts = await productModel.paginate({ status: status || true }, {
                    limit:limit || 10,
                    sort: { price: sort || 'asc' },
                    page: page || 1
                })
                console.log("Entro al 3")
            } else {
                dataProducts = await productModel.paginate({}, {
                    limit:limit || 10,
                    sort: { price: sort || 'asc' },
                    page: page || 1
                })
                console.log("Entro al default")
            }
            console.log("No entro")
            let  products = dataProducts.docs.map((item) => {
                return {
                    _id: item._id,
                    title: item.title,
                    description: item.description,
                    code: item.code,
                    price: item.price,
                    status: item.status,
                    stock: item.stock,
                    category: item.category,
                    thumbnails: item.thumbnails
                };
            });
            const { docs, ...rest } = dataProducts;
            
            return [products, rest]
        } catch (err) {
            console.log("ERROR")
            return { error: 'Se produjo un error inesperado' }
        }
    }
    getAll = async (req, res) => {
        try{            
            const carts = await cartModel.find().populate('products.product')
            return (carts)
        }catch (error) {
            res.status(500).json({
                status: 'Error',
                msg: 'No se pudieron obtener los carros',
            })
        }
    }
    
    getCartById = async (id) => {
        // const cart = await cartModel.findOne({ _id: id }, '_id ')
        const cart = await cartModel.findOne({ _id: id }).populate('products.product')
        const products = cart.products
        if(cart){
            return [cart, products]
        }else{
            console.log('No entro')            
        }
        // console.log("product.class: " + product.name)
        return "" //product
    }

    getTotal = async (id) => {     

        const cart = await cartModel.findOne({ _id: id }).populate('products.product')
        const products = cart.products
        const total = 0
        let  productsHandlebars = products.map((item) => {
            const subtotal = item.quantity * item.product.price            
            total = total + subtotal
            console.log("total " + total)        
        })
        
        return total
    }

    createCart = async () => {

    }

    updateCart = async (cartId, productId, quantity, operation) => { // OPERATION sumar, restar    
        try {
            const product = await productModel.findById(productId)
            // console.log(product)
            const cart = await cartModel.findById(cartId)
            // const stock = product.stock
            let total = 0
            // console.log("Stock: " + stock)
            const productInCartIndex = cart.products.findIndex(entry => entry.product._id.toString() == productId)
            console.log("productInCartIndex: " + productInCartIndex)

            switch (operation) {
                case 'add': 
                    if (productInCartIndex != -1) {
                        if (product) {
                            const existingQuantity = cart.products.find(entry => entry.product.toString() === productId)?.quantity || 0
                            const totalQuantity = existingQuantity + quantity
                            const subtotalPrice = product.price + totalQuantity
                            cart.products[productInCartIndex].quantity = totalQuantity
                            await cart.save()
                            const cartUpdated = await cartModel.findById(cartId).populate('products.product')
                            cartUpdated.products.map((item) => {      
                                console.log('Item. ' + (parseFloat(item.product.price) * parseInt(item.quantity)))
                                total = total + (item.product.price * item.quantity)
                            })

                            const response = {
                                status: 'success',
                                msg: 'El producto se agrego correctamente',
                                quantity: totalQuantity,
                                subtotal: subtotalPrice,
                                total: total
                            }                                
                            return JSON.stringify(response)                                
                        } else {
                            const response = {
                                status: 'error',
                                msg: 'El producto no se encontró'
                            }
                            return JSON.stringify(response)
                        }
                    } else {
                        const existingQuantity = cart.products.find(entry => entry.product.toString() === productId)?.quantity || 0
                        cart.products.push({ product: product._id, quantity: 1 })
                        await cart.save()
                        const cartUpdated = await cartModel.findById(cartId).populate('products.product')
                        const response = {
                            status: 'success',
                            msg: 'El producto se agrego correctamente'
                        }
                        return JSON.stringify(response)
                    }  
                    break;
                case 'remove':
                    if (productInCartIndex != -1) {
                        const existingQuantity = cart.products.find(entry => entry.product.toString() === productId)?.quantity || 0
                        if(existingQuantity>1){ // RESTO A LA CANTIDAD DE PRODUCTOS
                            const totalQuantity = existingQuantity - quantity
                            cart.products[productInCartIndex].quantity = totalQuantity
                            await cart.save()
                        }else{ //ELIMINO DIRECTAMENTE EL PRODUCTO
                            cart.products.splice(productInCartIndex, 1)                            
                            await cart.save()
                            const cartUpdated = await cartModel.findById(cartId).populate('products.product')
                        }
                        const response = {
                            status: 'success',
                            msg: 'El producto se elimino correctamente del carro'
                        }
                        return JSON.stringify(response)
                    }else{
                        const response = {
                            status: 'error',
                            msg: 'El producto no se encontro'
                        }
                        return JSON.stringify(response)
                    }
                    break;
                default:
                    const response = {
                        status: 'error',
                        msg: 'Ocurrio un error inesperado'
                    }
                    return JSON.stringify(response)
            }            
        } catch (e) {
            const response = {
                status: 'error',
                msg: 'Ocurrio un error inesperado'
            }
            return JSON.stringify(response)
        }
    }


    // deleteAllProductsFromCart = async (cartId) => {
    //     const cart = await cartModel.findOne({ _id: cartId })
    //     try {
    //         if(cart){
    //             cart.update({_id: cartId},
    //                 { $pull:products})
    //             const response = {
    //                 status: 'success',
    //                 msg: 'El carrito se vacio correctamente'
    //             }
    //             return JSON.stringify(response)
    //         }else{
    //             const response = {
    //                 status: 'error',
    //                 msg: 'El carro no se encontró'
    //             }
    //             return JSON.stringify(response)
    //         }
    //     } catch (error) {
    //         const response = {
    //             status: 'error',
    //             msg: 'Ocurrio un error inesperado'
    //         }
    //         return JSON.stringify(response)
    //     }
    // }

    deleteProductFromCart = async (cartId, productId) => {
        try {
            const product = await productModel.findById(productId)
            const cart = await cartModel.findOne({ _id: cartId })
            const productInCartIndex = cart.products.findIndex(entry => entry.product._id.toString() == productId)

            if (productInCartIndex != -1) {                
                const existingQuantity = cart.products[productInCartIndex].quantity
                const productStock = product.stock
                cart.products.splice(productInCartIndex, 1)
                await cart.save()        
                product.stock = existingQuantity + productStock
                await product.save()

                const response = {
                    status: 'success',
                    msg: 'El producto se eliminó correctamente del carro'
                }                
                return JSON.stringify(response)                
            }else{
                const response = {
                    status: 'success',
                    msg: 'No se encontro el producto'
                }                
                return JSON.stringify(response)                
            }
        } catch (error) {
            res.status(500).json({
                status: 'error',
                msg: 'Error',
            })
        }
    }

    updateStock = async (productId, stock) => {
        try {
            const product = await productModel.findById(productId)
        } catch (error) {
            
        }
    }
    
    purchase = async (cartId, user) => {
        try {
            // Obtengo el carro y los productos
            const cart = await cartModel.findOne({ _id: cartId }).populate('products.product')            
            // Creo las variables que se retornan
            let prodOutStock = []
            let prodStock = []
            let isTicket = false
            let ticket = ""

            // Si el carro existe
            if (cart) {          
                // Separo los productos y sus cantidades
                const products = cart.products

                // Valido si el carro tiene productos para procesar
                if(products.length > 0){                    
                    let amount = 0;
                    
                    // Recorro los productos para validar que haya stock disponible
                    products.map(async(prod, index) => {
                        // Si la cantidad requerida supera el stock lo agrega a un array prodOutStock para obtener el o los productos sin stock
                        if (prod.quantity > prod.product.stock) {
                            prodOutStock.push({ product: prod})
                        }else{
                            // Si hay stock suficiente le resto la cantidad solicitada en el carro para actualizar el stock
                            let newStock = prod.product.stock - prod.quantity                        
                
                            //Multiplicamos el precio por la cantidad y lo sumamos al total
                            let priceProduct = prod.product.price * prod.quantity                        
                            amount += priceProduct
                            //pusheamos al array para luego modificar el stock del producto con el nuevo stock
                            prodStock.push(prod);
                            const ProductModel = new productModel()
                            const product = await productModel.findById(prod.product._id)
                            product.stock = newStock
                            product.save()
    
                            const resul = await this.deleteProductFromCart(cartId, prod.product._id)
                        }
                    })
                    //Usamos .createTicket y  Creamos el ticket
                    if(prodStock.length > 0){
                        const TicketClass = new ticketClass()
                        ticket = await TicketClass.createTicket({
                            amount,
                            purchaser: user,//Este es el email del user que lo sacamos de req.session
                        })
                        isTicket = true
                    }                            
                    return [ticket, prodStock, prodOutStock, isTicket]
                }
                return [ticket, prodStock, prodOutStock, isTicket]
            } else {
                throw new Error('El carrito no existe');
            }
        } catch (error) {
            throw new Error(error.message);
        }
        
    }
}

module.exports = Cart