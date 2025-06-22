import { ticketsService } from "../services/services.js"

export class ticketsController {
    constructor() {
        this.ticketsService = ticketsService
    }

    createTicket = async (req, res) => {
        const newTicket = req.body
        const ticket = await this.ticketsService.createTicket(newTicket)
        res.send({ ticket })
    }
}