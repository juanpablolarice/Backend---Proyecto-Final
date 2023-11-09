const Product = require('../dao/mongo/models/product.model')

const showAllProductsService = async (category, status, limit, sort, page) => {
    let dataProducts = ''

    try {
        if (category && status) {
            dataProducts = await Product.paginate({ $or: [{ category: category }, { status: status || true }] }, {
                limit:limit || 10,
                sort: { price: sort || 'asc' },
                page: page || 1
            })
        } else if (category) {
            dataProducts = await Product.paginate({ category: category }, {
                limit:limit || 10,
                sort: { price: sort || 'asc' },
                page: page || 1
            })
        } else if (status) {
            dataProducts = await Product.paginate({ status: status || true }, {
                limit:limit || 10,
                sort: { price: sort || 'asc' },
                page: page || 1
            })
        } else {
            dataProducts = await Product.paginate({}, {
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
        return { error: 'Se produjo un error inesperado' }
    }
}

const getProductById = async (id) => {
    const product = await Product.findOne({ _id: id }, '_id title description code price status stock category thumbnails')
    console.log("Products.services: " + product)
    return product
}

module.exports = { showAllProductsService, getProductById }
