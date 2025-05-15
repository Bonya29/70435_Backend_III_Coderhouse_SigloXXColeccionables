export class productsRepository {
    constructor(productsDao) {
        this.productsDao = productsDao
    }

    getProducts = async () => {
        return await this.productsDao.getProducts()
    }

    generateProducts = async (products) => {
        return await this.productsDao.generateProducts(products)
    }
}