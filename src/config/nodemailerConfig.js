import nodemailer from 'nodemailer'
import { envConfig } from "./envConfig.js"

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: envConfig.mailUsername,
        pass: envConfig.mailPassword
    }
})