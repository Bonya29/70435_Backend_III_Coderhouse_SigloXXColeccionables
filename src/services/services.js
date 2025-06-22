import { productsDao } from "../dao/productsDao.js"
import { productsRepository } from "./productsRepository.js"
import { usersDao } from "../dao/usersDao.js"
import { usersRepository } from "./usersRepository.js"
import { cartsDao } from "../dao/cartsDao.js"
import { cartsRepository } from "./cartsRepository.js"
import { ticketsDao } from "../dao/ticketsDao.js"
import { ticketsRepository } from "./ticketsRepository.js"


export const productsService = new productsRepository(new productsDao())
export const usersService = new usersRepository(new usersDao())
export const cartsService = new cartsRepository(new cartsDao())
export const ticketsService = new ticketsRepository(new ticketsDao())