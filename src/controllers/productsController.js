import { productsService } from '../services/services.js'

export class productsController {
    constructor() {
        this.productsService = productsService
    }

    getProducts = async (req, res) => {
        const products = await this.productsService.getProducts()
        res.send({ products })
    }
}