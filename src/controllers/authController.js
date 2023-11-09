// const User = require("../dao/mongo/models/user.model");
const passport = require('passport')
const { createHash, isValidPassword } = require('../utils/bcrypts')
// const auth = require ('../dao/mongo/classes/user.model')

// const authMiddleware = async (req, res, next) => {
//     if(req.session.user){
//         if(req.session.user.role == 'User' || req.session.user.role == 'Admin'){
//             next()
//         }else{
//             return res.redirect('login')
//         }
//     }else{
//         return res.redirect('login')
//     }
// }

const showLogin = async (req, res) => {
    res.render('login')
}

const showRegisterForm = (req, res) => {
    res.render('register')
}

const logout = async (req, res) => {
    console.log("LOGOUT")
    req.session.destroy(err => {
        if(err) res.send('Failed logout')
        res.redirect('/login')
    })
}

module.exports = { showLogin, showRegisterForm, logout }
