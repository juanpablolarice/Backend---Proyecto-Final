const express = require('express')
const { Router } = express
const router = new Router()
const passport = require('passport')
const { authMiddleware, showLogin, login, showRegisterForm, register, logout } = require ('./../controllers/authController')

router.get('/', async (req, res) => {
    console.log("OK")
    res.redirect('login')
})

router.get('/register', showRegisterForm)

router.post('/register', passport.authenticate('register',
    {failureRedirect:'/registerFail'}), (req, res) =>{        
        req.session.user = req.user
        
        res.status(200).redirect('/products')
    })

router.get('/login', showLogin)

router.post('/login', passport.authenticate('login', {failureRedirect: '/loginFail'}), (req, res) => {        
    req.session.user = req.user
    
    res.status(200).redirect('/products')
})
router.get('/loginFail', (req, res) => {
    res.render('loginFail')
})
router.get('/registerFail', (req, res) => {
    res.render('registerFail')
})

router.get('/auth/github', passport.authenticate('auth-github',
    { scope: ['user:email'] })
);

router.get('/auth/github/callback', passport.authenticate('auth-github',
    { failureRedirect: '/'}),  (req, res) => {
        req.session.user = req.user
        res.status(200).redirect('/products')
});

router.get('/logout', logout)

router.get('api/sessions/current', async (req, res) => {
    try{
        // En el req.session.user se asigno el DTO de user
        res.status(200).send(req.session.user)
    }catch (error) {
        res.status(500).json({
            status: 'Error',
            msg: 'No se pudo obtener la sesión del usuario',
        })
    }
})

module.exports = router
