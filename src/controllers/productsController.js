import { productsService } from '../services/services.js'
import { generateMockProducts } from '../utils/mocks/productsMock.js'

export class productsController {
    constructor() {
        this.productsService = productsService
    }

    getProducts = async (req, res) => {
        try {
            const products = await this.productsService.getProducts()
        res.send({ products })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    generateProducts = async (req, res) => {
        const count = parseInt(req.params.count)
        if (isNaN(count) || count <= 0) return res.status(400).json({ error: 'Cantidad inválida' })

        try {
            const generatedProducts = await generateMockProducts(count)
            await this.productsService.generateProducts(generatedProducts)
            res.status(201).json({ message: `${count} productos generados`, data: generatedProducts })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}