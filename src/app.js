import express from 'express'
import { connectDB } from './utils/connectDB.js'
import { argumentss } from './utils/arguments.js'
import { envConfig } from './config/envConfig.js'
import { engine } from 'express-handlebars'
import { router as viewsRouter } from './routes/viewsRouter.js'
import { router as mocksRouter } from './routes/api/mocksRouter.js'
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./src/public'))
app.use('/', viewsRouter)
app.use('/api/mocks', mocksRouter)
app.set("view engine", "handlebars")
app.set("views", "./src/views")
app.engine("handlebars", engine())

const server = app.listen(envConfig.port, () => {
    console.log(`\nServer encendido en el puerto ${envConfig.port} \n\nurl: http://localhost:${envConfig.port}/ \n\nModo: ${argumentss.opts().mode}\n`)
})

app.get('/', (req, res) => {
    res.status(200).send('Servidor Encendido')
})

connectDB()