// const Product = require('../services/dao/mongo/classes/product.class')

// const { productClass } = require('../services/factory')
// const ProductModel = require('../services/dao/mongo/models/product.model')
// const Cart = require('../services/dao/mongo/classes/cart.class')
// const CartModel = require('../services/dao/mongo/models/cart.model')
// const config = require('../config/config')
// const MongoManager = require('../services/dao/mongo/db')
// const dbManager = new MongoManager(config.DB);
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
const { userClass } = require('../services/factory')
const UserModel = require('../services/dao/mongo/models/user.model')

const getAll = async (req, res) => {
    try{
        const { limit, sort, page } = req.query 
        const [users, rest] = await userClass.getAll(limit, sort, page)

        if(req.session.user.role=="Admin"){
            isAdmin = true
        }else{
            isAdmin = false
        }
        
        res.status(200).render('usersList', { 
            users,
            pagination: rest,
        })
    } catch (error) {
        console.log("ERROR EN CONTROLLER")
    }
}

const getUserById = async (req, res) => {
    try {
        let {id} = req.params
        console.log(id)
        const user = await userClass.getUserById(id)
        console.log(user)
        res.status(200).json({
            role: user.role
        })
    } catch (error) {
        console.log("ERROR EN CONTROLLER - GETUSERBYID")
    }
}

const deleteUsers = async (req, res) => {
    try {
        const filter = new Date();
        // FILTER se establece la cantidad de días desde la última sesión para eliminar esos usuarios
        filter.setDate(filter.getDate() - 2);        
        const usersDelete = await UserModel.find({ last_login: { $lt: today } });
        // SE ELIMINAN LOS USUARIOS Y SE ENVIA UN MAIL DE NOTIFICACIÓN
        // for (const user of usersDelete) {
            // Elimino el usuario y envio mail
            // await deleteAcountMail(user.email);
        // }
        // await User.deleteMany({ last_connection: { $lt: twoDaysAgo } });
        res.status(201).send('Usuarios eliminados con éxito');
    } catch (error) {
        res.status(500).send('Ocurrió un error al eliminar los usuarios');
    }
}

module.exports = { getAll, getUserById, deleteUsers }