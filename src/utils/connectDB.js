import mongoose from 'mongoose'
import { envConfig } from '../config/envConfig.js'
import { logger } from '../config/loggerConfig.js'

export const connectDB = async () => {
    try {
        await mongoose.connect(envConfig.mongoURI)
        logger.INFO('Base de datos de MongoDB conectada\n')
    } catch (error) {
        logger.ERROR(`Error al conectar a la base de datos: ${error}`)
    }
}