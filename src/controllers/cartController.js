// const UserModel = require("../dao/mongo/models/user.model");
const Cart = require("../services/dao/mongo/classes/cart.class");
const CartModel = require("../services/dao/mongo/models/cart.model");
const Product = require("../services/dao/mongo/classes/product.class");
const ProductModel = require("../services/dao/mongo/models/product.model");
const { sendEmailCheckout } = require("../controllers/emailController");

const getAll = async (req, res) => {
    try{
        const cartClass = new Cart()
        const carts = await cartClass.getAll()//.populate('products.product')        
        res.status(200).send(carts)
    }catch (error) {
        res.status(500).json({
            status: 'Error',
            msg: 'No se pudieron obtener los carros',
        })
    }
}

const getCartById = async (req, res) => {
    const { cid } = req.params
    try {
        const cartClass = new Cart()
        const cart = await cartClass.getCartById(cid)
        res.status(200).render('cart', {cart})
    } catch (error) {
        res.status(404).send({ error: 'Error al intentar encontrar carrito del usuario' })
    }
}

const getMyCart = async (req, res) => {
    try {
        if(req.session.user.cart){
            const cartClass = new Cart()
            const [cart, products] = await cartClass.getCartById(req.session.user.cart)
            let total = 0

            let  productsHandlebars = products.map((item) => {
                const subtotal = item.quantity * item.product.price            
                total = total + subtotal
                
                return {
                    _id: item.product._id,
                    title: item.product.title,
                    description: item.product.description,
                    code: item.product.code,
                    price: item.product.price,
                    status: item.product.status,
                    stock: item.product.stock,
                    category: item.product.category,
                    thumbnails: item.product.thumbnails,
                    quantity: item.quantity, 
                    subtotal: subtotal
                };
            });
            
            res.status(200).render('cart', {
                cart: cart, 
                products: productsHandlebars, 
                user: req.session.user,
                isAdmin:req.session.user.role==="Admin",
                total: total
            })
        }else{
            res.status(404).send({ error: 'Error al intentar encontrar carrito del usuario' })            
        }        
    } catch (error) {
        res.status(404).send({ error: 'Error al intentar encontrar carrito del usuario' })
    }
}

const createCart = async (req, res) => {
    try {
        let { products } = req.body
        let result  = await Cart.create({
            products
        })  
        return res.status(200).json({
            cart: result._id,
            status: 'success',
            msg: 'El carro se creó correctamente',
        });
    } catch (e) {
        return res.status(500).json({
            status: 'Error',
            msg: 'El carro no se pudo crear correctamente',
        });
    }
}

const createEmptyCart = async () => {
    try {        
        let result  = await Cart.create()  
        return result._id;
    } catch (e) {
        return res.status(500).json({           
            status: 'error',
            msg: 'Error al crear el carro vacio',
        });
    }
}

const updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { quantity, operation } = req.body

        if(req.session.user.role === 'Admin'){
            return res.status(500).json({
                status: 'error',
                msg: 'No tienes permiso para agregar productos al carrito',
            })
        }

        const cartClass = new Cart()
        const result = await cartClass.updateCart(cid, pid, quantity, operation)        
        
        res.status(200).send(result)
    } catch (e) {
        return res.status(500).json({
            status: 'Error',
            msg: 'El carro no se pudo actualizar correctamente',
        })
    }
}

const deleteCart = async (req, res) => {
    try {
        const { cid, pid } = req.params
        await Cart.findOneAndDelete({ _id: cid})

        return res.status(200).json({
            status: 'success',
            msg: 'El carro se eliminó correctamente',
        })
    } catch (e) {
        return res.status(500).json({
            status: 'Error',
            msg: 'El carro no se pudo eliminar correctamente',
        })
    }
}

const deleteProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params
        const cartClass = new Cart()
        const result = await cartClass.deleteProductFromCart(cid, pid)
                        
        return res.status(200).json({
            status: 'success',
            msg: 'Se eliminó el producto del carro correctamente',
        });
    } catch (e) {
        return res.status(500).json({
            status: 'Error',
            msg: 'No se pudo eliminar el producto correctamente',
        });
    }
}

const purchase = async (req, res) => {
    try {
        const { cid } = req.params
        const cartClass = new Cart()
        let emailStatus = false
        
        let total = 0
        const [ticket, prodStock, prodOutStock, isTicket] = await cartClass.purchase(cid, req.session.user.email)
        
        let  productsHandlebars = prodOutStock.map((item) => {
            const subtotal = (item.product.quantity * item.product.product.price)
            total = total + subtotal
            
            return {
                _id: item.product.product._id,
                title: item.product.product.title,
                description: item.product.product.description,
                code: item.product.product.code,
                price: item.product.product.price,
                status: item.product.product.status,
                stock: item.product.product.stock,
                category: item.product.product.category,
                thumbnails: item.product.product.thumbnails,
                quantity: item.product.quantity, 
                subtotal: subtotal
            };
        });

        let ticketHandlebars = ""
        if(ticket){
            ticketHandlebars = {
                code: ticket.code,
                amount: ticket.amount,
                purchaser: ticket.purchaser,
                purchaser_datetime: ticket.purchaser_datetime
            }
            emailStatus = sendEmailCheckout(prodStock, ticket)
        }

        return res.status(200).render('ticket', {
            productsOutStock: productsHandlebars,
            ticket: ticketHandlebars,
            isTicket: isTicket,
            emailStatus: emailStatus
        })
    } catch (e) {
        console.log('Cart Controller Error: ' + e)
        return res.status(500).json({
            status: 'Error',
            msg: 'No se pudo eliminar el producto correctamente',
        });
    }
}

module.exports = { getAll, getCartById, getMyCart, createCart, createEmptyCart, updateProductQuantity, deleteCart, deleteProductFromCart, purchase }
