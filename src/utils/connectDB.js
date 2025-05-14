import mongoose from 'mongoose'
import { envConfig } from '../config/envConfig.js'

export const connectDB = async () => {
    try {
        await mongoose.connect(envConfig.mongoURI)
        console.log('Base de datos de MongoDB conectada')
    } catch (error) {
        console.log(error)
    }
}