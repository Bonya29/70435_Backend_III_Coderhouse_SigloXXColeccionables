import { ticketsModel } from './models/ticketsModel.js'

export class ticketsDao {
    constructor() {
        this.model = ticketsModel
    }
    createTicket = async (newTicket) => {
        return await this.model.create(newTicket)
    }
}