const fs = require("fs")
const path = './users.json'

// Creo el archivo si no existe
if(!fs.existsSync('./users.json')){
    fs.writeFileSync('./users.json', '[]', {encoding:"utf-8"})
}

class User {
    static id = 0
    constructor(path){
        this.path = path
    }

    allUsers = async () => {
        console.log("ENTRO A LA PERSISTENCIA FILESYSTEM")
        try{
            let users = await fs.promises.readFile(this.path, "utf-8")
            console.log(JSON.parse(users))
            return JSON.parse(users);
        }catch(err){
            console.log(err)
        }
    }

    // getProductsLimit = async (limit) => {
    //     try{
    //         let products = await getProducts()
    //         return limit;
    //         let filter = []
    //         products.forEach(element => filter.push(element))
    //         return filter;

    //         return JSON.parse(filter);
    //     }catch(err){
    //         return(err)
    //         console.log(err)
    //     }
    // }

    // getProductById = async (id) => {
    //     try {
    //         let products = await this.getProducts()
    //         let filter = products.find(product => product.id == id )

    //         if(filter){
    //             return filter
    //         }else{
    //             return "El ID ingresado no existe"
    //         }
    //     } catch (err) {
    //         return(err)
    //         console.log(err)
    //     }
    // }

    // addProduct = async (title, description, code, price, status, stock, thumbnails) => {
    //     try {
    //         let products = await this.getProducts()
    //         let productsUpdated = []
    //         let product = {
    //             id: ProductManager.id,
    //             title: title,
    //             description: description,
    //             code: code,
    //             price: price,
    //             status: status,
    //             stock: stock,
    //             thumbnails: thumbnails
    //         }

    //         if(products.length >0){
    //             let codeExists = products.find(product => product.code === code)
    //             if(codeExists){
    //                 return console.log("Ya existe un producto con ese código")
    //             }
    //             let maxId = Math.max.apply(Math, products.map(function(prod) { return prod.id; }));
    //             ProductManager.id = maxId + 1
    //             product.id = ProductManager.id
    //             productsUpdated = [products, product]
    //         }else{
    //             ProductManager.id++
    //             product.id = ProductManager.id
    //             productsUpdated = [product]
    //         }
    //         products.push(product)
    //         let write = await fs.writeFile(this.path, JSON.stringify(products, null, 2), (err) => err && console.error(err))
    //     } catch (e) {
    //         return(err)
    //         console.log(err)
    //     }
    // }

    // deleteProduct = async (id) => {
    //     try {
    //         let products = await this.getProducts()
    //         const index = products.findIndex(prod => prod.id == id)

    //         if(index == -1){
    //             return "El ID del producto ingresado no existe"
    //         }else{
    //             products.splice(index, 1)
    //             let write = await fs.writeFileSync(this.path, JSON.stringify(products, null, 2), {encoding:"utf-8"})
    //             return "El producto se eliminó correctamente"
    //         }
    //     } catch (err) {
    //         return(err)
    //         console.log(err)
    //     }
    // }

    // updateProduct = async (id, product) => {// title, description, code, price, status, stock, thumbnails) => {
    //     let products = await this.getProducts()
    //     const index = products.findIndex(prod => prod.id == id)

    //     if(index != -1){
    //         let codeExists = false
    //         products.forEach((prod) => {
    //             if(prod.code === product.code && prod.id != id){
    //                 codeExists = true
    //             }
    //         })
    //         if(codeExists){
    //             return "Ya existe un producto con ese código"
    //         }
    //         products[index] = { ...products[index], ...product }
    //         await fs.writeFile(this.path, JSON.stringify(products, null, 2), (err) => err && console.error(err))
    //         return "El producto se actualizó correctamente"
    //     }else{
    //         throw new Error("El ID del producto ingresado no existe")
    //     }
    // }
}

module.exports = User;
