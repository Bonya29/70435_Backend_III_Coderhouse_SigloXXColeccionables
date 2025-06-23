import { usersService } from '../services/services.js'
import { cartsService } from "../services/services.js"
import { generateMockUsers } from '../utils/mocks/usersMock.js'
import { createHash, isValidPassword } from "../utils/hashPassword.js"
import { generateToken } from "../utils/generateToken.js"
import { UserDto } from "../dto/usersDto.js"
import { CustomError } from '../utils/customErrors.js'
import { errors } from '../utils/errors.js'

export class usersController {
    constructor() {
        this.usersService = usersService
        this.cartsService = cartsService
    }

    getUsers = async (req, res) => {
        try {
            const users = await this.usersService.getUsers()
            res.send({ users })
        } catch (error) {
            CustomError.new(errors.fatal)
            res.status(error.statusCode || 500).json({ error: error.message })
        }
    }

    generateUsers = async (req, res) => {
        const count = parseInt(req.params.count)
        if (isNaN(count) || count <= 0) {
            return res.status(400).json({ error: 'Cantidad inválida' })
        }
    
        try {
            const generatedUsers = await generateMockUsers(count)
            await this.usersService.generateUsers(generatedUsers)
            res.status(201).json({ message: `${count} usuarios generados`, data: generatedUsers })
        } catch (error) {
            CustomError.new(errors.fatal)
            res.status(error.statusCode || 500).json({ error: error.message })
        }
    }

    getUsersByID = async (req, res) => {
        const { id } = req.params
        try {
            const user = await this.usersService.getUserById(id)
            if (!user) {
                return res.status(404).send({ status: "error", error: "Usuario no encontrado" })
            }
            res.send({ status: "success", payload: user })
        } catch (error) {
            CustomError.new(errors.fatal)
            res.status(error.statusCode || 500).json({ error: error.message })
        }
    }

    register = async (req, res) => {
        const { first_name, last_name, gender, email, age, password} = req.body
        if (!first_name || !last_name || !gender || !email || !age || !password) {
            return res.status(400).send({ status: "error", error: "Campos incompletos" })
        }
        if (email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)) {
            return res.status(400).send({ status: "error", error: "El email ingresado es invalido" })
        }
        const user = await this.usersService.getUserByEmail(email)
        if (user) {
            return res.status(400).send({ status: "error", error: "Ya existe un usuario registrado con ese email" })
        }
        if (age < 13) {
            return res.status(400).send({ status: "error", error: "Debes ser mayor de 13 años para registrarte" })
        }

        try {
            const newCart = await this.cartsService.createCart()
            const userDto = new UserDto({ ...req.body,  password: createHash(password), cartId: newCart._id })
            const newUser = await this.usersService.createUser({ ...userDto })

            res.send({ status: 'success', message: 'Registro Exitoso', payload: newUser })
        } catch (error) {
            CustomError.new(errors.fatal)
            res.status(error.statusCode || 500).json({ error: error.message })
        }
    }

    login = async (req, res) => {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).send({ status: "error", error: "Campos incompletos" })
        }
        const user = await this.usersService.getUserByEmail(email)
        if (!user) {
            return res.status(400).send({ status: "error", error: "No existe un usuario registrado con ese email" })
        }
        if (!isValidPassword(user, password)) {
            return res.status(400).send({ status: "error", error: "Contraseña incorrecta" })
        }

        try {
            const token = generateToken({
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                gender: user.gender,
                age: user.age,
                email: user.email,
                role: user.role,
                cartId: user.cartId
            })

            res.cookie('sigloXXColeccionablesToken', token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true }).send({ status: 'success', message: 'Login Exitoso' })
        } catch (error) {
            CustomError.new(errors.fatal)
            res.status(error.statusCode || 500).json({ error: error.message })
        }
    }

    logout = async (req, res) => {
        try {
            res.clearCookie('sigloXXColeccionablesToken').send({ status: 'success', message: 'Logout Exitoso' })
        } catch (error) {
            CustomError.new(errors.fatal)
            res.status(error.statusCode || 500).json({ error: error.message })
        }
    }

    deleteAccountById = async (req, res) => {
        try {
            const { id } = req.params
            const user = await this.usersService.getUserById(id)
            const cid = user.cartId
            await this.usersService.deleteUserById(id)
            await this.cartsService.deleteCartById(cid)
            res.send({ status: 'success', message: 'Cuenta eliminada' })
        } catch (error) {
            CustomError.new(errors.fatal)
            res.status(error.statusCode || 500).json({ error: error.message })
        }
        
    }

    current = (req, res) => {
        res.json({ status: "success", user: req.user })
    }
}