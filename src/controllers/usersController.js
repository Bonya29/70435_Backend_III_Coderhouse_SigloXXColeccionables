import { usersService } from '../services/services.js'
import { generateMockUsers } from '../utils/mocks/usersMock.js'

export class usersController {
    constructor() {
        this.usersService = usersService
    }

    getUsers = async (req, res) => {
        try {
            const users = await this.usersService.getUsers()
            res.send({ users })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    generateUsers = async (req, res) => {
        const count = parseInt(req.params.count)
        if (isNaN(count) || count <= 0) return res.status(400).json({ error: 'Cantidad inválida' })
    
        try {
            const generatedUsers = await generateMockUsers(count)
            await this.usersService.generateUsers(generatedUsers)
            res.status(201).json({ message: `${count} usuarios generados`, data: generatedUsers })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}