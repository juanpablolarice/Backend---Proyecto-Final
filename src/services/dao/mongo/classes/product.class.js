const productModel = require('../models/product.model')
const cartModel = require('../models/cart.model')


class Product {    
    constructor(){
        this.data = []
    }

    validateProduct = async (product) => {
        console.log("ENTRO")
        let errors = []
        let status = 'success'
        if(product.title === '' || typeof product.title !== 'string'){
            errors.push('El <strong>título</strong> del producto es obligatorio')
            status = 'danger'
            console.log(`
                title:{
                    type:String,
                    unique:true,
                    required:true
                }
            `)
        }
        if(product.description === '' || typeof product.description !== 'string'){
            errors.push('La <strong>descripción</strong> del producto es obligatoria')
            status = 'danger'
            console.log(`
                description:{
                    type:String,
                    required:true
                }
            `)
        }
        if(product.code === '' || typeof product.code !== 'string'){
            errors.push('El <strong>código</strong> del producto es obligatorio')
            status = 'danger'
            console.log(`
                code:{
                    type:String,
                    unique:true,
                    required:true
                }
            `)
        }
        // product.price = parseFloat(product.price)
        if(product.price === ''){
            errors.push('El <strong>precio</strong> del producto es obligatorio')
            status = 'danger'
            console.log(`
                price:{
                    type:Number,
                    required:true
                }
            `)
        }
        if(product.status === 'true'){
            product.status = true
        }else{
            product.status = false
        }
        if(product.status === null || typeof product.status !== 'boolean'){
            errors.push('El <strong>estado</strong> del producto es obligatorio  ' + typeof product.status)
            status = 'danger'
            console.log(`
                status:{
                    type:Boolean,
                    required:true,
                }
            `)
        }
        // product.stock = parseFloat(product.stock)
        if(product.stock === ''){
            errors.push('El <strong>stock</strong> del producto es obligatorio')
            status = 'danger'
            console.log(`
                stock:{
                    type:Number,
                    required:true
                }
            `)
        }

        if(product.category === '' || typeof product.category !== 'string'){
            errors.push('La <strong>categoría</strong> del producto es obligatoria')
            status = 'danger'
            console.log(`
                category:{
                    type:String,
                    required:true,
                    enum:['Televisores', 'Celulares', 'Notebooks']
                }
            `)
        }
        if(typeof product.thumbnails !== 'string'){
            errors.push('La <strong>imagen</strong> del producto no esta en el formato correcto')
            status = 'danger'
            console.log(`
                thumbnails:[{
                    type:String
                }]
            `)
        }        
        return [errors, status];
    }

    allProducts = async (category, status, limit, sort, page) => {
        let dataProducts = ''
        try {
            if (category && status) {
                dataProducts = await productModel.paginate({ $or: [{ category: category }, { status: status || true }] }, {
                    limit:limit || 10,
                    sort: { price: sort || 'asc' },
                    page: page || 1
                })
            } else if (category) {
                dataProducts = await productModel.paginate({ category: category }, {
                    limit:limit || 10,
                    sort: { price: sort || 'asc' },
                    page: page || 1
                })
            } else if (status) {
                dataProducts = await productModel.paginate({ status: status || true }, {
                    limit:limit || 10,
                    sort: { price: sort || 'asc' },
                    page: page || 1
                })
            } else {
                dataProducts = await productModel.paginate({}, {
                    limit:limit || 10,
                    sort: { price: sort || 'asc' },
                    page: page || 1
                })
            }
            
            let  products = dataProducts.docs.map((item) => {
                return {
                    _id: item._id,
                    title: item.title,
                    description: item.description,
                    code: item.code,
                    price: item.price,
                    status: item.status,
                    stock: item.stock,
                    category: item.category,
                    thumbnails: item.thumbnails
                };
            });
            const { docs, ...rest } = dataProducts;
            
            return [products, rest]
        } catch (err) {
            console.log("ERROR")
            return { error: 'Se produjo un error inesperado' }
        }
    }
    
    
    getProductById = async (id) => {
        console.log("getProductById")
        try {
            const product = await productModel.findOne({ _id: id });
            return product;
        } catch (error) {
            throw new Error(error.message);
        }
        // console.log("Product.class")
        // const product = await productModel.findOne({ _id: id }, '_id title description code price status stock category thumbnails')
        // if(product){
        //     console.log('Entro')                
        //     return product
        // }else{
        //     console.log('No entro')            
        // }
        // // console.log("product.class: " + product.name)
        // return "" //product
    }
    
    updateProduct = async (productId, product) => {
        let message = []           
        let status = 'success'
        try {
            await productModel.updateOne({_id: productId},  {
                title: product.title,
                description: product.description,
                code: product.code,
                price: product.price,
                status: product.status,
                stock: product.stock,
                category: product.category
            });
            // Falta actualizar el array de imagenes
            message.push('El producto se actualizo correctamente')
            return [message, status]
        } catch (e) {            
            message.push('Ocurrió un error inesperado')
            status = 'danger'
            return [message, status]
        }
    }

    storeProduct = async (newProduct) => {
        let message = ''           
        let status = 'success'
        try {
            const code = await productModel.findOne({ code: newProduct.code }, '_id title description code price status stock category thumbnails')
            const title = await productModel.findOne({ title: newProduct.title }, '_id title description code price status stock category thumbnails')

            if(code){
                message = 'Ya existe un producto con ese código'
                status = 'danger'
            }else if(title){
                message = 'Ya existe un producto con ese título'
                status = 'danger'
            }else{
                let result = await productModel.create(newProduct)
                message = 'El producto se creó correctamente'                
            }
            return [message, status]
        } catch (e) {
            message = 'Ocurrió un error inesperado'
            status = 'danger'
            return [message, status]
        }
    }

    getArrProductsData = async (arr) => {
        const productsData = [];

        for (const id of arr) {
            const product = await productModel.findOne({ _id: id })
            productsData.push(product);
        }
      
        return productsData;
    }

    deleteProduct = async (pid) => {        
        try {
            console.log("Product Class")
            const resul = await productModel.deleteOne({_id: pid})
            return resul       
        } catch (error) {
            const response = {
                status: 'error',
                msg: 'El producto no se encontro'
            }
            return JSON.stringify(response)
        }
    }
}

module.exports = Product