import jwt from 'jsonwebtoken'
import { envConfig } from '../config/envConfig.js'
export const generateToken = (userDataToken) => jwt.sign(userDataToken, envConfig.privateKey, {expiresIn: '2h'})