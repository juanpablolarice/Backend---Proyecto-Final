const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUIExpress = require('swagger-ui-express');
const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
const handlebars = require('express-handlebars')
const cookiesParser = require('cookie-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const MongoStore = require('connect-mongo')
const passport = require('passport')
const initializePassport = require('./src/config/passport')
const dotenv = require('dotenv').config()
const config = require('./src/config/config')
const { addLogger } = require('./src/config/logger')


const http = require('http')
const server = http.createServer(app)
const {Server} = require('socket.io')
const io = new Server(server)
const MongoManager = require('./src/services/dao/mongo/db')
const dbManager = new MongoManager(config.DB);
const Cart = require('./src/services/dao/mongo/models/cart.model')
const Product = require('./src/services/dao/mongo/models/product.model')

const routesSessions = require('./src/routes/sessions')
const routesProducts = require('./src/routes/products')
const routesCarts = require('./src/routes/carts')
const routesUsers = require('./src/routes/users')
const routesMocking = require('./src/routes/mocking')


app.engine('handlebars', handlebars.engine({
    helpers: {
        getStringifiedJson: function (value) {
            return JSON.stringify(value);
        }
    },
    partialsDir: ['src/views/partials/'],
    defaultLayout: 'main'
}));

app.set('views', __dirname+'/src/views')
app.set('view engine', 'handlebars' )

// app.use(addLogger)
app.get('/logger', addLogger, (req, res) => {
    // req.logger.warn("Prueba de log level warn!")
    // req.logger.info("Prueba de log level info!")
    res.send('Prueba de logger')
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookiesParser());

if(config.PERSISTENCE === 'mongodb'){
    app.use(session({
        store: MongoStore.create({
            mongoUrl: config.DB
        }),
        secret:'secretCoder',
        resave:true,
        saveUninitialized:true
    }))
}else{
    app.use(session({
        secret:'secretCoder',
        resave:true,
        saveUninitialized:true
    }))
}

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentacion API",
            description: "Documentacion para uso del ecommerce"
        }
    },
    apis: [`./src/docs/**/*.yaml`]
};
const specs = swaggerJSDoc(swaggerOptions);
//Declare swagger api endpoint
app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs));



initializePassport()
app.use(passport.initialize())
app.use(passport.session())
app.use(cors({origin:'http://localhost:5500', methods:['GET', 'POST', 'PUT']}))
app.use(express.static(__dirname+'/public'))

// app.use('/', routesAuth)
app.use('/', routesProducts)
app.use('/', routesUsers)
app.use('/', routesCarts)
app.use('/', routesSessions)
app.use('/', routesMocking)


let messages = []
// socket
io.on('connection', (socket) => {
    console.log('New user conected')
    // socket.emit('welcome', 'Hola cliente, bienvenido.')

    socket.on('new-message', (data) => {
        messages.push(data)
        io.sockets.emit('messages-all', messages)
    })
})

server.listen(config.PORT, () => {
    console.log('Servidor corriendo en el puerto 8080')
    // console.log("Persistence: " + config.PERSISTENCE)
    // console.log("Enviroment: " + config.ENVIROMENT)
    // dbManager.connect()
})
