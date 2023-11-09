const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GitHubStrategy = require('passport-github2').Strategy
const userModel = require('../services/dao/mongo/models/user.model')
const cartModel = require('../services/dao/mongo/models/cart.model')
const {createEmptyCart} =require('../controllers/cartController')
const {createHash, isValidPassword} = require('../utils/bcrypts')
const userDTO = require('../services/dto/user.dto')

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField:'email'},
        async (req, username, password, done) => {
            try {
                let userData = req.body
                // BUSCAR SI EXISTE EL USUARIO                
                const user = await userModel.findOne({email: username})                
                if(user) {
                    done(null, false)
                }                
                
                const cart = await cartModel.create({})
                console.log(cart)
                let userNew = {
                    name: userData.name,
                    age: userData.age,
                    phone: userData.phone,
                    cart: cart._id,
                    email: userData.email,
                    password: await createHash(userData.password),
                    role: 'User',
                    last_login: new Date()
                }
                
                let result = await userModel.create(userNew)
                const userCreated = await userModel.findOne({email: username})
                const userDto = new userDTO(userCreated)
                done(null, userDto)
            } catch (e) {
                return done("Error al crear el usuario: " + e)
            }
        },
        passport.serializeUser((user, done) => {
            done(null, user._id)
        }),
        passport.deserializeUser(async (id, done) => {
            let user = await userModel.findById(id)
            done(null, user)
        }),
    )),
    passport.use('login', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email',
            passwordField: 'password'
        },
        async (req, username, password, done) =>{
            try {
                console.log("Procesando login")
                // return "estoy aca"
                // TENGO QUE LLAMAR AL CONTROLLER
                const userData = await userModel.findOne({ email: username });
                if(userData){
                    const validPassword = await isValidPassword( userData, password );
                    if(validPassword){
                        const user = await userModel.findOne({email: username})
                        user.last_login = new Date()
                        await user.save()
                        const userDto = new userDTO(user)                        
                        return done(null, userDto);
                    }else{                        
                        return done(null, false, {message: 'El usuario y la clave no coinciden...'});
                    }
                }else{
                    return done(null, false, { message: 'El usuario no existe...'});
                }
            } catch (e) {
                return done(e);
            }
        }
    )),
    passport.use('auth-github', new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "/auth/github/callback"
        },
        async function (accessToken, refreshToken, profile, done){
            try {
                let user = await userModel.findOne({ email: `${profile._json.login}@github.com.ar`}, '_id name email phone age cart role')
                
                if(user == null){
                    const cart = await cartModel.create({})

                    let newUser = {
                        name: profile._json.name,
                        age: 30,
                        cart: cart._id,
                        phone: '1122334455',
                        email: `${profile._json.login}@github.com.ar`,
                        password: await createHash('password'),
                        role: 'User',
                        last_login: new Date()
                    }

                    let result = await userModel.create(newUser)
                    const userDto = new userDTO(result)
                    done(null, userDto)
                }else{
                    user.last_login = new Date()
                    await user.save()
                    done(null, user)
                }
            }catch(error){
                done(error)
            }
        }
    ))
}

module.exports = initializePassport
