export class ticketsRepository {
    constructor(ticketsDao) {
        this.ticketsDao = ticketsDao
    }

    createTicket = async (newTicket) => await this.ticketsDao.createTicket(newTicket)
}