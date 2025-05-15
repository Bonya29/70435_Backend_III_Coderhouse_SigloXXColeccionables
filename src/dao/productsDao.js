import { productsModel } from "./models/productsModel.js"

export class productsDao {
    constructor() {
        this.model = productsModel
    }
    
    getProducts = async () => {
        return await this.model.find().lean()
    }

    generateProducts = async (products) => {
        return await productsModel.insertMany(products)
    }
}