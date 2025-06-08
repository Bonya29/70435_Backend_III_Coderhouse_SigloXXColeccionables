// Nota: Una vez ejecutado el script, se borraran todos los datos de la base de datos de MongoDB y se añadiran los que se encuentran en los archivos JSON de la carpeta "data".
// Para ejecutar el script, dirigirse a la consola, posicionarse sobre la carpeta del proyecto y escribir 'node .\src\data\dataLoader.js' (sin comillas)

import fs from "fs/promises"
import { connectDB } from "../utils/connectDB.js"
import { logger } from "../config/loggerConfig.js"
import { productsModel } from "../dao/models/productsModel.js"
import { usersModel } from "../dao/models/usersModel.js"
import { cartsModel } from "../dao/models/cartsModel.js"
import { ticketsModel } from "../dao/models/ticketsModel.js"

let products = []
let users = []

const loadData = async () => {
    try {
        const productsData = await fs.readFile("./src/data/products.json", "utf-8")
        const usersData = await fs.readFile("./src/data/users.json", "utf-8")
        products = JSON.parse(productsData)
        users = JSON.parse(usersData)
    } catch (err) {
        logger.ERROR(`Error al leer los archivos JSON: ${err.message}`)
        process.exit()
    }
}

const insertData = async () => {
    try {
        await connectDB()

        await loadData()

        await productsModel.deleteMany()
        await usersModel.deleteMany()
        await cartsModel.deleteMany()
        await ticketsModel.deleteMany()

        let dataProducts = await productsModel.insertMany(products)
        let dataUsers = await usersModel.insertMany(users)

        logger.INFO(`Productos Cargados: ${dataProducts}\n`)
        logger.INFO(`Usuarios Cargados: ${dataUsers}\n`)
        logger.INFO(`Se ha reiniciado la base de datos. Datos de products y users añadidos a la base de datos de MongoDB con exito.\n`)
        process.exit()
    } catch (err) {
        logger.ERROR(`Error al conectarse con el servidor de BD o al cargar los datos: ${err.message}`)
    }
}

insertData();