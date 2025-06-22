import { logger } from '../config/loggerConfig.js'

export class CustomError {
    static new({ message, statusCode }) {
        const error = new Error(message)
        error.statusCode = statusCode
        logger.ERROR(`[${statusCode}] ${message}`)
        throw error
    }
}