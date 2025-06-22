export class usersRepository {
    constructor(usersDao) {
        this.usersDao = usersDao
    }

    getUsers = async () => await this.usersDao.getUsers()
    generateUsers = async (users) => await this.usersDao.generateUsers(users)
    getUserById = async (id) => await this.usersDao.getUserById(id)
    getUserByEmail = async (email) => await this.usersDao.getUserByEmail(email)
    createUser = async (newUser) => await this.usersDao.createUser(newUser)
    deleteUserById = async (id) => await this.usersDao.deleteUserById(id)
}