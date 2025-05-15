export class productsRepository {
    constructor(productsDao) {
        this.productsDao = productsDao
    }

    getProducts = async () => {
        return await this.productsDao.getProducts()
    }
}