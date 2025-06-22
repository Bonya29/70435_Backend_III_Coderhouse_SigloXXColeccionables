import { logger } from '../config/loggerConfig.js'

export function errorHandler(err, req, res, next) {
    logger.ERROR(`[${err.statusCode || 500}] ${err.message}`)
    res.status(err.statusCode || 500).json({ error: err.message })
}