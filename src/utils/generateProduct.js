const { faker } = require('@faker-js/faker')



const generateProduct = async () => {
    const aux = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.number.hex(),
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        stock: faker.number.int({ max: 100 }),
        category: faker.helpers.arrayElements(['Televisores', 'Celulares', 'Notebooks']),
        thumbnails: [
            faker.image.url(),
            faker.image.url(),
            faker.image.url()
        ]
    }
    // console.log(aux)
    return aux
}

module.exports = { generateProduct }