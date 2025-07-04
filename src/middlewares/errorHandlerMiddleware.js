import { errors } from '../utils/errors.js'

export function errorHandler(err, req, res, next) {
    console.log(err)
    const { method, originalUrl: url } = req
    const error = err.message || errors.fatal.message
    const statusCode = err.statusCode || errors.fatal.statusCode
    res.status(statusCode).json({
        error,
        method,
        url,
    })
}