export class usersRepository {
    constructor(usersDao) {
        this.usersDao = usersDao
    }

    getUsers = async () => {
        return await this.usersDao.getUsers()
    }
}