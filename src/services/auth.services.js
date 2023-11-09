const User = require("../dao/mongo/models/user.model");

const authMiddleware = async (req, res, next) => {
    if(req.session.user){        
        if(req.session.user.role == 'User' || req.session.user.role == 'Admin'){            
            next()
        }else{
            return res.redirect('login')
        }
    }else{
        return res.redirect('login')
    }
}

const isAdmin = async (req, res, next) => {
    if(req.session.user){        
        if(req.session.user.role == 'Admin'){            
            next()
        }else{
            console.log('No esta autorizado')
            return res.status(400).send('No esta autorizado')
        }
    }else{
        return res.redirect('/login')
    }
}

const isUser = async (req, res, next) => {
    if(req.session.role){        
        if(req.session.user.role == 'User'){
            next()
        }else{
            console.log('No esta autorizado')
            return res.status(400).send('No esta autorizado')
        }
    }else{
        return res.redirect('/login')
    }
}

module.exports = { authMiddleware, isAdmin, isUser }