export class cartsRepository {
    constructor(cartsDao) {
        this.cartsDao = cartsDao
    }
    
    getCartById = async (cid) => await this.cartsDao.getCartById(cid)
    getCardByIdWithPopulate = async (cid) => await this.cartsDao.getCardByIdWithPopulate(cid)
    createCart = async () => await this.cartsDao.createCart()
    addProductToCartById = async (cid, pid) => await this.cartsDao.addProductToCartById(cid, pid)
    updateProductQuantityFromCartById = async (cid, pid, action) => await this.cartsDao.updateProductQuantityFromCartById(cid, pid, action)
    deleteProductFromCartById = async (cid, pid) => await this.cartsDao.deleteProductFromCartById(cid, pid)
    deleteProductsFromCartByIdAfterPurchase = async (cid) => await this.cartsDao.deleteProductsFromCartByIdAfterPurchase(cid)
    deleteCartById = async (cid) => await this.cartsDao.deleteCartById(cid)
}