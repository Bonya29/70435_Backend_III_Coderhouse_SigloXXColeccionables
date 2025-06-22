async function getCurrentUserData() {
    const response = await fetch('/api/users/current', { credentials: 'include' })
    if (!response.ok) return null
    const data = await response.json()
    return data.user || null
}

async function showProducts() {
    const userData = await getCurrentUserData()
    const userId = userData ? userData.id : null
    const userRole = userData ? userData.role : null
    const response = await fetch('/api/products')
    const data = await response.json()
    const products = data.products

    const productsContainer = document.getElementById('products')
    productsContainer.innerHTML = ""

    products.forEach(product => {
        const outStock = product.stock === 0
        productsContainer.innerHTML += `
            <div class="card shadow product-card" id="${product._id}">
                <div class="card-image">
                    <img src="${product.image}" class="card-img-top img-size">
                </div>
                <hr>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">${product.description}</p>
                    <div class="mt-auto">
                        <p class="card-text">$${product.price}</p>
                        <p class="card-text">Disponibles: ${product.stock}</p>
                    </div>
                    <div class="text-center mt-2">
                        ${userRole && userRole !== 'admin' ? `<button type="button" class="btn btn-success" onclick="addProductToCart('${product._id}', '${userId}')" ${outStock ? 'disabled' : ''}>Añadir al Carrito</button>` : ''}
                    </div>
                </div>
            </div>
        `
    })
}

async function addProductToCart(pid, userId) {
    const cartCount = document.getElementById('cart-count')
    let response = await fetch(`/api/users/${userId}`, {
        method: 'GET',
    })

    let data = await response.json()
    let userData = data.payload
    let cartId = userData.cartId

    response = await fetch(`/api/carts/${cartId}`, {
        method: 'GET',
    })

    data = await response.json()
    let cartData = data.cart
    
    let existProduct = cartData.products.find(p => p.product.toString() === pid)

    if (existProduct) {
        swal.fire({
            toast: true,
            title: "El producto ya se encuentra en el carrito",
            position: "bottom-end",
            showConfirmButton: false,
            timer: 1750,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer
                toast.onmouseleave = Swal.resumeTimer
            }
        })
    } else {
        response = await fetch(`/api/carts/${cartId}/product/${pid}`, {
            method: 'POST',
            }
        )
        
        if (response.ok) {
            const response = await fetch(`/api/carts/${cartId}`, {
                method: 'GET',
            })

            const data = await response.json()
            cartCount.innerHTML = ` (${data.cart.products.length})`

            Swal.fire({
                toast: true,
                title: "Producto Agregado al Carrito",
                position: "bottom-end",
                showConfirmButton: false,
                timer: 1750,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer
                    toast.onmouseleave = Swal.resumeTimer
                }
            })
        }
    }
}

showProducts()