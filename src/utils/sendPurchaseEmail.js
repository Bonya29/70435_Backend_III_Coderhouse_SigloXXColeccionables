import { transporter } from '../config/nodemailerConfig.js'
import { envConfig } from '../config/envConfig.js'

export const sendPurchaseEmail = async (to, code) => {
    await transporter.sendMail({
        from: `SigloXXColeccionables <${envConfig.mailUsername}>`,
        to: to,
        subject: 'Compra Realizada',
        html: `
            <h2>¡Gracias por tu compra!</h2><br>
            <p><strong>Código de compra:</strong> ${code}</p><br>
            <p>📝Guarda tu codigo de compra, sera solicitado para entregarte tu pedido</p><br>
            <p>👋¡Esperamos verte pronto nuevamente!</p><br>
            <img src="cid:logo" alt="logo" />
        `,
        attachments: [
            {
                filename: 'logo.png',
                path: './src/public/assets/logo.png',
                cid: 'logo'
            }
        ]
    })
}