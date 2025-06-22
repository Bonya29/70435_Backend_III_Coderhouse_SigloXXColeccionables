import { usersModel } from './models/usersModel.js'

export class usersDao {
    constructor() {
        this.model = usersModel
    }

    getUsers = async () => {
        return await this.model.find().lean()
    }

    generateUsers = async (users) => {
        return await this.model.insertMany(users)
    }

    getUserById = async (id) => {
        return await this.model.findById(id)
    }

    getUserByEmail = async (email) => {
        return await this.model.findOne({ email })
    }

    createUser = async (newUser) => {
        return await this.model.create(newUser)
    }

    deleteUserById = async (id) => {
        return await this.model.findByIdAndDelete(id)
    }
}