const ProductClass  = require("./product.class")
const productClass = new ProductClass();
const CartClass = require( "./cart.class")
const TicketModel = require( "../models/ticket.model")
// const ticketClass = new TicketClass()

class Ticket {    
    constructor(){
        this.data = []
    }

    createTicket = async (tk) => {
        const newTk = await TicketModel.create(tk);
        console.log("CREO EL TICKET EN TICKET.CLASS")
        return newTk
    }

    // //Modificamos el stock de aquellos productos que tenian stock 
    updateStock = async(prodStock) => {
        prodStock.map(async (prod, index) => {
            await productService.updateStockProduct(prod.idProduct, prod.stock)
            console.log("se modifico stock de los product",prodStock);
    
        })
    }

    getTickets = async () => {
        const newTk = await TicketMethods.getAll();
        return newTk

    }
    deletePurchase = async() => {
        const newTk = await TicketMethods.deletePurchase();
        return newTk

    }

}
module.exports = Ticket