import { productsDao } from "../dao/productsDao.js"
import { productsRepository } from "./productsRepository.js"
import { usersDao } from "../dao/usersDao.js"
import { usersRepository } from "./usersRepository.js"

export const productsService = new productsRepository(new productsDao())
export const usersService = new usersRepository(new usersDao())