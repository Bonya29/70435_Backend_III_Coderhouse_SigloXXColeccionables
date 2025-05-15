import { faker } from '@faker-js/faker'
import { productsModel } from '../../dao/models/productsModel.js'

export const generateMockProducts = async (count = 1) => {
    const products = []

    for (let i = 0; i < count; i++) {
        const product = {
            image: faker.image.url({ width: 225, height: 225 }),
            title: faker.commerce.productName() + " " + faker.string.uuid().slice(0, 4),
            description: faker.commerce.productDescription(),
            price: parseFloat(faker.commerce.price()),
            stock: faker.number.int({ min: 1, max: 100 }),
            category: faker.commerce.department(),
            code: faker.string.uuid(),
            status: faker.datatype.boolean()
        }

        products.push(product)
    }

    return await productsModel.insertMany(products)
}