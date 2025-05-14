import dotenv from 'dotenv'
import { argumentss } from '../utils/arguments.js'

const path = `.env.${argumentss.opts().mode}`

dotenv.config({ path })

export const envConfig = {
    port: process.env.port,
    mongoURI: process.env.mongoURI
}