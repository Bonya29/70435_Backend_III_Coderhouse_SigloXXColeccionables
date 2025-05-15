import { Router } from 'express'
import { usersController } from '../../controllers/usersController.js'
export const router = Router()

const { getUsers } = new usersController()

router.get('/', getUsers)