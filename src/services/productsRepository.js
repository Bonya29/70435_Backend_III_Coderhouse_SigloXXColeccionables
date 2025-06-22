export class productsRepository {
    constructor(productsDao) {
        this.productsDao = productsDao
    }

    getProducts = async () => await this.productsDao.getProducts()
    generateProducts = async (products) => await this.productsDao.generateProducts(products)
    getProductById = async (id) => await this.productsDao.getProductById(id)
    getProductByTitle = async (title) => await this.productsDao.getProductByTitle(title)
    createProduct = async (newProduct) => await this.productsDao.createProduct(newProduct)
    updateProductById = async (id, newProduct) => await this.productsDao.updateProductById(id, newProduct)
    updateProductStockById = async (pid, quantity) => await this.productsDao.updateProductStockById(pid, quantity)
    deleteProductById = async (id) => await this.productsDao.deleteProductById(id)
}