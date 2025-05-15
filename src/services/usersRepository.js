export class usersRepository {
    constructor(usersDao) {
        this.usersDao = usersDao
    }

    getUsers = async () => {
        return await this.usersDao.getUsers()
    }

    generateUsers = async (users) => {
        return await this.usersDao.generateUsers(users)
    }
}