import { Router } from 'express'
import { usersController } from '../../controllers/usersController.js'
import { passportCall } from "../../middlewares/passportCallMiddleware.js"
export const router = Router()

const { getUsers, getUsersByID, register, login, logout, deleteAccountById, current } = new usersController()

router.get('/', getUsers)
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.delete('/deleteAccount/:id', deleteAccountById)
router.get("/current", passportCall("jwt"), current)
router.get('/:id', getUsersByID)