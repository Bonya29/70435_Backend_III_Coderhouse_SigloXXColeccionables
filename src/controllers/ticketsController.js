import { ticketsService } from "../services/services.js"
import { CustomError } from '../utils/customErrors.js'
import { errors } from '../utils/errors.js'

export class ticketsController {
    constructor() {
        this.ticketsService = ticketsService
    }

    createTicket = async (req, res) => {
        try {
            const newTicket = req.body
            const ticket = await this.ticketsService.createTicket(newTicket)
            res.send({ ticket })
        } catch (error) {
            CustomError.new(errors.fatal)
            res.status(error.statusCode || 500).json({ error: error.message })
        }
        
    }
}