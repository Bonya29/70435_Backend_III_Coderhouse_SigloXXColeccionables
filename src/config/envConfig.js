import dotenv from 'dotenv'
import { argumentss } from './argumentsConfig.js'

const path = `.env.${argumentss.opts().mode}`

dotenv.config({ path })

export const envConfig = {
    port: process.env.port,
    mongoURI: process.env.mongoURI
}