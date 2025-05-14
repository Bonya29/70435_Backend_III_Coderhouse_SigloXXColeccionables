import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
    {
        image: {type: String, required: true},
        title: {type: String, unique: true, required: true},
        description: {type: String, required: true},
        price: {type: Number, required: true},
        stock: {type: Number, required: true},
        category: {type: String, required: true},
        code: {type: String, unique: true, required: true},
        status: {type: Boolean, default: false},
    },
    {
        timestamps: true
    },
    {
        collection: 'products'
    }
)

export const productsModel = mongoose.model('products', productSchema)