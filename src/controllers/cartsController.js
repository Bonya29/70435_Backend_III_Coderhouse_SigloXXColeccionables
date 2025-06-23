import { cartsService } from "../services/services.js"
import { productsService } from "../services/services.js"
import { ticketsService } from "../services/services.js"
import { sendPurchaseEmail } from "../utils/sendPurchaseEmail.js"
import { CustomError } from '../utils/customErrors.js'
import { errors } from '../utils/errors.js'

export class cartsController {
    constructor() {
        this.cartsService = cartsService
        this.productsService = productsService
        this.ticketsService = ticketsService
    }

    getCartById = async (req, res) => {
        try {
            const { cid } = req.params
            const cart = await this.cartsService.getCartById(cid)
            res.send({ cart })
        } catch (error) {
            CustomError.new(errors.fatal)
            res.status(error.statusCode || 500).json({ error: error.message })
        }
    }

    getCardByIdWithPopulate = async (req, res) => {
        try {
            const { cid } = req.params
            const cart = await this.cartsService.getCardByIdWithPopulate(cid)
            res.send({ cart })
        } catch (error) {
            CustomError.new(errors.fatal)
            res.status(error.statusCode || 500).json({ error: error.message })
        }
    }

    addProductToCartById = async (req, res) => {
        try {
            const { cid, pid } = req.params
            const updatedCart = await this.cartsService.addProductToCartById(cid, pid)
            res.status(200).json({ message: 'Producto agregado al carrito', cart: updatedCart })
        } catch (error) {
            CustomError.new(errors.fatal)
            res.status(error.statusCode || 500).json({ error: error.message })
        }
    }

    updateProductQuantityFromCartById = async (req, res) => {
        try {
            const { cid, pid, action } = req.params
            const updatedCart = await this.cartsService.updateProductQuantityFromCartById(cid, pid, action)
            res.status(200).json({ message: 'Cantidad del producto actualizada', cart: updatedCart })
        } catch (error) {
            CustomError.new(errors.fatal)
            res.status(error.statusCode || 500).json({ error: error.message })
        }
    }

    deleteProductFromCartById = async (req, res) => {
        try {
            const { cid, pid } = req.params
            const updatedCart = await this.cartsService.deleteProductFromCartById(cid, pid)
            res.status(200).json({ message: 'Producto eliminado del carrito', cart: updatedCart })
        } catch (error) {
            CustomError.new(errors.fatal)
            res.status(error.statusCode || 500).json({ error: error.message })
        }
    }

    deleteProductsFromCartByIdAfterPurchase = async (req, res) => {
        try {
            const { cid } = req.params
            const to = req.body.purchaser
            const code = req.body.code
            const cart = await this.cartsService.getCardByIdWithPopulate(cid)
            await this.ticketsService.createTicket({ ...req.body })

            await Promise.all(
                cart.products.map(item => {
                    const product = item.product
                    const quantity = item.quantity
                    return this.productsService.updateProductStockById(product._id, quantity)
                })
            )

            await this.cartsService.deleteProductsFromCartByIdAfterPurchase(cid)

            sendPurchaseEmail(to, code)
            res.status(200).json({ message: 'Compra realizada, carrito vaciado, ticket creado y mail enviado al cliente'})
        } catch (error) {
            CustomError.new(errors.fatal)
            res.status(error.statusCode || 500).json({ error: error.message })
        }
    }
}