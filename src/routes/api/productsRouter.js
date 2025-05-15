import { Router } from 'express'
import { productsController } from '../../controllers/productsController.js'
export const router = Router()

const { getProducts } = new productsController()

router.get('/', getProducts)