import { Router } from 'express'
import { productsController } from '../../controllers/productsController.js'
import { usersController } from '../../controllers/usersController.js'
export const router = Router()

const { generateProducts } = new productsController()
const { generateUsers } = new usersController()

router.post('/products/:count', generateProducts)
router.post('/users/:count', generateUsers)