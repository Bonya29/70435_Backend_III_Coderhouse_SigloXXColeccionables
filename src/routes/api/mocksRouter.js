import { Router } from 'express'
import { generateMockProducts } from '../../utils/mocks/productsMock.js'
import { generateMockUsers } from '../../utils/mocks/usersMock.js'
export const router = Router()

router.post('/products/:count', async (req, res) => {
    const count = parseInt(req.params.count)
    if (isNaN(count) || count <= 0) return res.status(400).json({ error: 'Cantidad inválida' })

    try {
        const createdProducts = await generateMockProducts(count)
        res.status(201).json({ message: `${count} productos generados`, data: createdProducts })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/users/:count', async (req, res) => {
    const count = parseInt(req.params.count)
    if (isNaN(count) || count <= 0) return res.status(400).json({ error: 'Cantidad inválida' })

    try {
        const createdUsers = await generateMockUsers(count)
        res.status(201).json({ message: `${count} usuarios generados`, data: createdUsers })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})