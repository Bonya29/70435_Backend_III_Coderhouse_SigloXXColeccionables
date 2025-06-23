import { expect } from 'chai'
import supertest from 'supertest'

const testPort = 5001

const request = supertest(`http://localhost:${testPort}/api`)

// Nota: En caso de que el test falle en el primer intento, borrar los datos generados en la base de datos de test y volver a intentarlo.

describe('Testing Users API Endpoints', () => {

    let userId
    let cookie

    it (
        'GET /users - Debería devolver una lista de usuarios', async () => {
            const response = await request.get('/users')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('users').that.is.an('array')
        }
    )

    it (
        'POST /users/register - Debería registrar un nuevo usuario', async () => {
            const newUser = {
                first_name: 'Test',
                last_name: 'User',
                gender: "N/A",
                age: 13,
                email: 'test.user@example.com',
                password: 'Test1234'
            }

            const response = await request.post('/users/register').send(newUser)
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('status', 'success')
            expect(response.body).to.have.property('payload')
            
            userId = response.body.payload._id
        }
    )

    it (
        'POST /users/login - Debería iniciar sesión con un usuario existente y devolver una cookie', async () => {
            const userCredentials = {
                email: 'test.user@example.com',
                password: 'Test1234'
            }

            const response = await request.post('/users/login').send(userCredentials)
            expect(response.status).to.equal(200)
            expect(response.headers['set-cookie']).to.exist

            const rawCookie = response.headers['set-cookie'][0]
            cookie = rawCookie.split(';')[0]
        }
    )

    it('GET /users/current - debería devolver el usuario actual con JWT', async () => {
            const response = await request.get('/users/current').set('Cookie', cookie)
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('status', 'success')
            expect(response.body).to.have.property('user')
        }
    )


    it (
        'POST /users/logout - Debería cerrar la sesión del usuario y borrar la cookie', async () => {
            const response = await request.post('/users/logout').set('Cookie', cookie)
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('message', 'Logout Exitoso')
        }
    )

    it (
        'DELETE /users/deleteAccount/:id - Debería eliminar un usuario por el ID indicado', async () => {
            const response = await request.delete(`/users/deleteAccount/${userId}`).set('Cookie', cookie)
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('message', 'Cuenta eliminada')
        }
    )
})

describe('Testing Products API Endpoints', () => {

    const newProduct = {
        image: "/assets/products/noImageYet.png",
        title: "Producto de Testeo",
        description: "Este es un producto de prueba para testing",
        price: 9999,
        stock: 999,
        category: "Estampillas",
        code: "A999",
        status: true
    }

    let productId

    it ('POST /products - debería crear un nuevo producto', async () => {
        const response = await request.post('/products').send(newProduct)
        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('product')

        productId = response.body.product._id
    })

    it ('GET /products - debería devolver una lista de productos', async () => {
        const response = await request.get('/products')
        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('products').that.is.an('array')
    })

    it ('GET /products/:pid - debería devolver un producto por el ID indicado', async () => {
        const response = await request.get(`/products/${productId}`)
        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('product')
    })

    it ('GET /products/title/:title - debería devolver un producto por el título indicado', async () => {
    const res = await request.get(`/products/title/${encodeURIComponent(newProduct.title)}`)
    expect(res.status).to.equal(200)
    expect(res.body).to.have.property('product')
    expect(res.body.product).to.have.property('title', newProduct.title)
})

    it ('PUT /products/:pid - debería actualizar un producto por el ID indicado', async () => {
        const updatedProduct = { ...newProduct, price: 6000 }
        const response = await request.put(`/products/${productId}`).send(updatedProduct)
        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('product')
        expect(response.body.product).to.have.property('price', 6000)
    })

    it ('DELETE /products/:pid - debería eliminar un producto por el ID indicado', async () => {
        const response = await request.delete(`/products/${productId}`)
        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('product')
        expect(response.body.product).to.have.property('_id', productId)
    })
})

describe('Testing Carts API Endpoints', () => { 

    // Nota: Si se quiere realizar el test una segunda vez, se deberan borrar manualmente los usuarios y productos generados anteriormente en la base de datos "test".
    let cartId
    let productId

    const productData = {
        image: "/assets/products/noImageYet.png",
        title: "Producto de Testeo 2",
        description: "Este es un producto de prueba para testing",
        price: 9999,
        stock: 999,
        category: "Estampillas",
        code: "A9999",
        status: true
    }

    const userData = {
        first_name: 'Test',
        last_name: 'User',
        gender: "N/A",
        age: 13,
        email: 'test.user2@example.com',
        password: 'Test1234'
    }

    const mailData = {
        code: `ticket-${Date.now()}`,
        amount: 100,
        purchaser: 'cliente@test.com'
    }

    before(async () => {
        const prodRes = await request.post('/products').send(productData)
        productId = prodRes.body.product._id

        const userRes = await request.post('/users/register').send(userData)
        cartId = userRes.body.payload.cartId
    })

    it ('POST /carts/:cid/product/:pid - debería agregar el producto indicado al carrito indicado', async () => {
        const res = await request.post(`/carts/${cartId}/product/${productId}`)
        expect(res.status).to.equal(200)
        expect(res.body.cart.products[0].product).to.equal(productId)
    })

    it ('PUT /carts/:cid/product/:pid/quantity/increase - debería incrementar la cantidad', async () => {
        const res = await request.put(`/carts/${cartId}/product/${productId}/quantity/increase`)
        expect(res.status).to.equal(200)
        expect(res.body.cart.products[0].quantity).to.equal(2)
    })

    it ('GET /carts/:cid/products - debería obtener el carrito con populate', async () => {
        const res = await request.get(`/carts/${cartId}/products`)
        expect(res.status).to.equal(200)
        expect(res.body.cart.products[0]).to.have.property('product')
        expect(res.body.cart.products[0].product).to.have.property('title', productData.title)
    })

    it('PUT /carts/:cid/product/:pid - debería eliminar el producto del carrito', async () => {
        const res = await request.put(`/carts/${cartId}/product/${productId}`)
        expect(res.status).to.equal(200)
        expect(res.body.cart.products).to.have.lengthOf(0)
    })

    it ('POST /carts/:cid/purchase - debería vaciar el carrito y generar compra', async () => {
        await request.post(`/carts/${cartId}/product/${productId}`)

        const res = await request.post(`/carts/${cartId}/purchase`).send(mailData)

        expect(res.status).to.equal(200)
        expect(res.body.message).to.include('Compra realizada')
    })
})