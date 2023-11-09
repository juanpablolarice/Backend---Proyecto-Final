const User = require("../services/dao/mongo/models/user.model");

const sessionActive = async (req, res, next) => {
    if(req.session.user){        
        if(req.session.user.role == 'User' || req.session.user.role == 'Admin'){            
            next()
        }else{
            console.log('No coincide la sesion')
            return res.redirect('login')
        }
    }else{
        return res.render('407')
        console.log("Debes iniciar sesión")
        return res.redirect('login')
    }
}

const isAdmin = async (req, res, next) => {    
    if(req.session.user){
        if(req.session.user.role == 'Admin'){                        
            next()
        }else{
            console.log('No esta autorizado')
            return res.render('401')
            return res.redirect(401, '/products')
        }
    }else{
        return res.redirect('/login')
    }
}

const isUser = async (req, res, next) => {
    if(req.session.user){
        if(req.session.user.role == 'User'){
            next()
        }else{
            console.log('No esta autorizado')
            return res.render('401')
            return res.status(400).redirect('/products')
        }
    }else{
        return res.redirect('/login')
    }
}

const isPremium = async (req, res, next) => {
    if(req.session.user){
        if(req.session.user.role == 'Premium'){
            next()
        }else{
            console.log('No esta autorizado')
            return res.render('401')
            return res.status(400).redirect('/products')
        }
    }else{
        return res.redirect('/login')
    }
}

const userForCart = async (req, res, next) => {
    if(req.session.user){
        console.log("Entro al middleware")
        console.log("VALIDO")
        const { cid } = req.params
        if(req.session.user.cart == cid){
            next()
        }else{
            console.log('No esta autorizado')
            return res.status(400).send({
                status: "error",
                msg: "Acceso denegado"
            })
        }
    }
}

module.exports = { sessionActive, isAdmin, isUser, isPremium, userForCart }