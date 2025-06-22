import express from 'express'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import { connectDB } from './utils/connectDB.js'
import { argumentss } from './config/argumentsConfig.js'
import { envConfig } from './config/envConfig.js'
import { logger } from './config/loggerConfig.js'
import { initializePassport } from './config/passportConfig.js'
import { errorHandler } from './middlewares/errorHandlerMiddleware.js'
import { engine } from 'express-handlebars'
import { router as viewsRouter } from './routes/viewsRouter.js'
import { router as mocksRouter } from './routes/api/mocksRouter.js'
import { router as productsRouter } from './routes/api/productsRouter.js'
import { router as usersRouter } from './routes/api/usersRouter.js'
import { router as cartsRouter } from './routes/api/cartsRouter.js'
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./src/public'))
app.use(cookieParser())
app.use(passport.initialize())
app.use('/', viewsRouter)
app.use('/api/mocks', mocksRouter)
app.use('/api/products', productsRouter)
app.use('/api/users', usersRouter)
app.use('/api/carts', cartsRouter)
app.use(errorHandler)
app.set("view engine", "handlebars")
app.set("views", "./src/views")
app.engine("handlebars", engine())

const server = app.listen(envConfig.port, () => {
    logger.INFO(`Modo: ${argumentss.opts().mode}\n`)
    logger.INFO(`Server encendido en el puerto ${envConfig.port}\n`)
    logger.HTTP(`URL: http://localhost:${envConfig.port}/\n`)
})

app.get('/', (req, res) => {
    res.status(200).send('Servidor Encendido')
})

connectDB()

initializePassport()