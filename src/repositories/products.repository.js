const productModel = require('../dao/mongo/models/product.model')

class ProductRepository {
    // constructor(dao){
    //     this.dao = dao
    // }

    allProducts = async (category, status, limit, sort, page) => {
        let dataProducts = ''
    
        try {
            if (category && status) {
                dataProducts = await productModel.paginate({ $or: [{ category: category }, { status: status || true }] }, {
                    limit:limit || 10,
                    sort: { price: sort || 'asc' },
                    page: page || 1
                })
                console.log("Entro al 1")
            } else if (category) {
                dataProducts = await productModel.paginate({ category: category }, {
                    limit:limit || 10,
                    sort: { price: sort || 'asc' },
                    page: page || 1
                })
                console.log("Entro al 2")
            } else if (status) {
                dataProducts = await productModel.paginate({ status: status || true }, {
                    limit:limit || 10,
                    sort: { price: sort || 'asc' },
                    page: page || 1
                })
                console.log("Entro al 3")
            } else {
                dataProducts = await productModel.paginate({}, {
                    limit:limit || 10,
                    sort: { price: sort || 'asc' },
                    page: page || 1
                })
                console.log("Entro al 4")
            }
            console.log("No entro")
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
            return { error: 'Se produjo un error inesperado' }
        }
    }
    
    getProductById = async (id) => {
        const product = await productModel.findOne({ _id: id }, '_id title description code price status stock category thumbnails')
        console.log("product.class: " + product)
        return product
    }

    
}

module.exports = ProductRepository