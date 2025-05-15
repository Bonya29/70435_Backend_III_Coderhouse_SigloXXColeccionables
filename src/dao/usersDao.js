import { usersModel } from './models/usersModel.js'

export class usersDao {
    constructor() {
        this.model = usersModel
    }

    getUsers = async () => {
        return await this.model.find().lean()
    }

    generateUsers = async (users) => {
        return await usersModel.insertMany(users)
    }
}