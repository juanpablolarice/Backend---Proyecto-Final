const config = require('../config/config')
// const mongoSingleton = require('../config/mongodb-singleton')
const mongoDB = require('./dao/mongo/db')
const dbManager = new mongoDB(config.DB);
const productMongodb = require('./dao/mongo/classes/product.class.js')
const cartMongodb = require('./dao/mongo/classes/cart.class.js')
const userMongodb = require('./dao/mongo/classes/user.class.js')
// const sessionMongodb = require('./dao/mongo/classes/session.class.js')
const productFilesystem = require('./dao/filesystem/classes/product.class.js')
const userFilesystem = require('./dao/filesystem/classes/user.class.js')


let productClass
let cartClass
let userClass
// let sessionClass
// async function mongoConnect() {

//     mongoose.connect(this.path,
//         {useUnifiedTopology:true, useNewUrlParser:true},)
//         .then(connect=>{
//             console.log('Conexión a db exitosa.')
//         })
//         .catch(err => console.log(err))
// }

console.log("FACTORY PERSISTENCE: " + config.PERSISTENCE)
switch (config.PERSISTENCE) {
    case 'mongodb':
        dbManager.connect()
        // const { default: Product } = await import('./dao/mongo/classes/product.class.js');
        userClass = new userMongodb();
        productClass = new productMongodb();
        cartClass = new cartMongodb();
        // let sessionClass = mongoDB.collection('sessions');
        // console.log(sessionClass)
        console.log("PERSISTENCE: mongodb")
        break;
    case 'filesystem':
        // productClass = new productFilesystem();
        userClass = new userFilesystem()
        console.log("PERSISTENCE: filesystem")
        break;
    default:
        console.log("PERSISTENCE: " + config.PERSISTENCE)
        break;
}

module.exports = { userClass, productClass, cartClass }