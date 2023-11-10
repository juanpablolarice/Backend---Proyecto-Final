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
            isAdmin: isAdmin
        })
    } catch (error) {
        console.log("ERROR EN CONTROLLER")
    }
}

const getUserById = async (req, res) => {
    try {
        let {id} = req.params
        // console.log(id)
        const user = await userClass.getUserById(id)
        // console.log(user)
        res.status(200).json({
            user: user
        })
    } catch (error) {
        console.log("ERROR EN CONTROLLER - GETUSERBYID")
    }
}

const updateRoleByUserId = async (req, res) => {
    try {
        const {id} = req.params
        const {role} = req.body
        console.log("USER ID: " + id)
        console.log("ROLE: " + role)
        const user = await userClass.updateRoleByUserId(id, role)

        console.log(user)
        if(user){
            res.status(200).json({
                msg: 'El rol del usuario se actualizó correctamente',
                status: 'success'
            }) 
        }else{
            res.status(400).json({
                msg: 'El rol del usuario no se pudo actualizar',
                status: 'error'
            }) 
        }
    } catch (error) {
        console.log("ERROR EN CONTROLLER")
        res.status(400).json({
            msg: 'El rol del usuario no se pudo actualizar',
            status: 'error'
        }) 
    }
}

const deleteUsers = async (req, res) => {
    try {
        const filter = new Date();
        // FILTER se establece la cantidad de días desde la última sesión para eliminar esos usuarios
        filter.setDate(filter.getDate() - 5);        
        const usersDelete = await UserModel.find({ last_login: { $lt: filter } });
        
        for (const user of usersDelete) {           
            console.log(user)
            // FALTA ELIMINAR AL USUARIO Y LUEGO ENVIAR EL EMAIL
            const result = await userClass.deleteUserByEmail(user.email)
        }        
        res.status(201).send('Usuarios eliminados con éxito');
    } catch (error) {
        res.status(500).send('Ocurrió un error al eliminar los usuarios');
    }
}

module.exports = { getAll, getUserById, deleteUsers, updateRoleByUserId }