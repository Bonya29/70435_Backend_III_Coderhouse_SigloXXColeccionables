import { usersService } from '../services/services.js'

export class usersController {
    constructor() {
        this.usersService = usersService
    }

    getUsers = async (req, res) => {
        const users = await this.usersService.getUsers()
        res.send({ users })
    }
}