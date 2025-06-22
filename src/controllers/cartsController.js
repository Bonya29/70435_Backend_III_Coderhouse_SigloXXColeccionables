import { cartsService } from "../services/services.js"
import { productsService } from "../services/services.js"
import { ticketsService } from "../services/services.js"
import { sendPurchaseEmail } from "../utils/sendPurchaseEmail.js"

export class cartsController {
    constructor() {
        this.cartsService = cartsService
        this.productsService = productsService
        this.ticketsService = ticketsService
    }

    getCartById = async (req, res) => {
        const { cid } = req.params
        const cart = await this.cartsService.getCartById(cid)
        res.send({ cart })
    }

    getCardByIdWithPopulate = async (req, res) => {
        const { cid } = req.params
        const cart = await this.cartsService.getCardByIdWithPopulate(cid)
        res.send({ cart })
    }

    addProductToCartById = async (req, res) => {
        const { cid, pid } = req.params
        const updatedCart = await this.cartsService.addProductToCartById(cid, pid)
        res.status(200).json({ message: 'Producto agregado al carrito', cart: updatedCart })
    }

    updateProductQuantityFromCartById = async (req, res) => {
        const { cid, pid, action } = req.params
        const updatedCart = await this.cartsService.updateProductQuantityFromCartById(cid, pid, action)
        res.status(200).json({ message: 'Cantidad del producto actualizada', cart: updatedCart })
    }

    deleteProductFromCartById = async (req, res) => {
        const { cid, pid } = req.params
        const updatedCart = await this.cartsService.deleteProductFromCartById(cid, pid)
        res.status(200).json({ message: 'Producto eliminado del carrito', cart: updatedCart })
    }

    deleteProductsFromCartByIdAfterPurchase = async (req, res) => {
        const { cid } = req.params
        const to = req.body.purchaser
        const code = req.body.code
        const cart = await this.cartsService.getCardByIdWithPopulate(cid)
        await this.ticketsService.createTicket({ ...req.body })
        
        for (const item of cart.products) {
            const product = item.product
            const quantity = item.quantity
            await this.productsService.updateProductStockById(product._id, quantity)
        }

        const updatedCart = await this.cartsService.deleteProductsFromCartByIdAfterPurchase(cid)

        
        await sendPurchaseEmail(to, code)
        res.status(200).json({ message: 'Compra realizada, carrito vaciado, ticket creado y mail enviado al cliente'})
    }
}