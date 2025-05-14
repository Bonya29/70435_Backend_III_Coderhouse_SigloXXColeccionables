import { Router } from 'express'
import { viewsController } from '../controllers/viewsController.js'
export const router = Router()

const { home, productsManagement, register, login, cart, profile } = new viewsController()

router.get('/home', home)
router.get('/productsManagement', productsManagement)
router.get('/register', register)
router.get('/login', login)
router.get('/cart', cart)
router.get('/profile', profile)