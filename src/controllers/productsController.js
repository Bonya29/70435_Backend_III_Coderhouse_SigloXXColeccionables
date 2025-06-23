import { productsService } from '../services/services.js'
import { generateMockProducts } from '../utils/mocks/productsMock.js'
import { CustomError } from '../utils/customErrors.js'
import { errors } from '../utils/errors.js'

export class productsController {
    constructor() {
        this.productsService = productsService
    }

    getProducts = async (req, res) => {
        try {
            const products = await this.productsService.getProducts()
        res.send({ products })
        } catch (error) {
            CustomError.new(errors.fatal)
            res.status(error.statusCode || 500).json({ error: error.message })
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
            CustomError.new(errors.fatal)
            res.status(error.statusCode || 500).json({ error: error.message })
        }
    }

    getProductById = async (req, res) => {
        try {
            const { pid } = req.params
            const product = await this.productsService.getProductById(pid)
            res.send({ product })
        } catch (error) {
            CustomError.new(errors.fatal)
            res.status(error.statusCode || 500).json({ error: error.message })
        }
    }

    getProductsByTitle = async (req, res) => {
        try {
            const { title } = req.params
            const product = await this.productsService.getProductByTitle(title)
            res.send({ product })
        } catch (error) {
            CustomError.new(errors.fatal)
            res.status(error.statusCode || 500).json({ error: error.message })
        }
    }

    createProduct = async (req, res) => {
        try {
            const newProduct = req.body
            const product = await this.productsService.createProduct(newProduct)
            res.send({ product })
        } catch (error) {
            CustomError.new(errors.fatal)
            res.status(error.statusCode || 500).json({ error: error.message })
        }
    }

    updateProductById = async (req, res) => {
        try {
            const { pid } = req.params
            const newProduct = req.body
            const product = await this.productsService.updateProductById(pid, newProduct)
            res.send({ product })
        } catch (error) {
            CustomError.new(errors.fatal)
            res.status(error.statusCode || 500).json({ error: error.message })
        }
    }

    updateProductStockById = async (req, res) => {
        try {
            const { pid } = req.params
            const { quantity } = req.body
            const product = await this.productsService.updateProductStockById(pid, quantity)
            res.send({ product })
        } catch (error) {
            CustomError.new(errors.fatal)
            res.status(error.statusCode || 500).json({ error: error.message })
        }
    }

    deleteProductById = async (req, res) => {
        try {
            const { pid } = req.params
            const product = await this.productsService.deleteProductById(pid)
            res.send({ product })
        } catch (error) {
            CustomError.new(errors.fatal)
            res.status(error.statusCode || 500).json({ error: error.message })
        }
    }
}