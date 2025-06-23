import { productsModel } from "./models/productsModel.js"

export class productsDao {
    constructor() {
        this.model = productsModel
    }
    
    getProducts = async () => {
        return await this.model.find().lean()
    }

    generateProducts = async (products) => {
        return await this.model.insertMany(products)
    }

    getProductById = async (id) => {
        return await this.model.findById(id)
    }

    getProductByTitle = async (title) => {
        return await this.model.findOne({title})
    }

    createProduct = async (newProduct) => {
        return await this.model.create(newProduct)
    }

    updateProductById = async (id, newProduct) => {
        return await this.model.findByIdAndUpdate(id, newProduct, { new: true }).lean()
    }

    updateProductStockById = async (pid, quantity) => {
        const product = await this.model.findById(pid)
            product.stock -= quantity
        return await product.save()
    }

    deleteProductById = async (id) => {
        return await this.model.findByIdAndDelete(id)
    }
}
