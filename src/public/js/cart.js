async function showCart() {
    let response = await fetch('/api/users/current', {
        method: 'GET',
        credentials: 'include'
    })
    let data = await response.json()
    const user = data.user

    response = await fetch(`/api/carts/${user.cartId}/products`, {
        method: 'GET'
    })
    data = await response.json()
    const cart = data.cart

    const cartAmountContainer = document.getElementById('cart-amount')
    const cartContainer = document.getElementById('cart-container')

    if (cart.products.length === 0) {
        cartContainer.innerHTML = `
            <h2 class="text-center">Tu carrito está vacío, añade productos para empezar a armarlo</h2>
        `
        cartAmountContainer.innerHTML = ''
    } else {
        let tableHTML = `
        <table class="table table-striped align-middle">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Producto</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Subtotal</th>
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
        `

        let cartAmount = 0
        cart.products.forEach((product, idx) => {
            const subtotal = product.product.price * product.quantity
            cartAmount += subtotal
            tableHTML += `
                <tr>
                    <th scope="row">${idx + 1}</th>
                    <td>
                        <img src="${product.product.image}" alt="${product.product.title}" style="width:40px; height:40px; object-fit:cover; margin-right:8px;">
                        ${product.product.title}
                    </td>
                    <td>$${product.product.price}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="decreaseQuantity('${user.cartId}', '${product.product._id}', ${product.quantity})">-</button>
                        <span class="mx-2">${product.quantity}</span>
                        <button class="btn btn-sm btn-primary" onclick="increaseQuantity('${user.cartId}', '${product.product._id}', ${product.product.stock}, ${product.quantity})">+</button>
                    </td>
                    <td>$${subtotal}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="deleteProduct('${user.cartId}', '${product.product._id}')">Eliminar</button>
                    </td>
                </tr>
            `
        })

        tableHTML += `
            </tbody>
        </table>
        `

        cartContainer.innerHTML = tableHTML

        cartAmountContainer.innerHTML = `
            <b>Total del Carrito: $${cartAmount}</b>
            <button class="btn btn-primary" onclick="checkStockAndProceed('${user.cartId}', ${cartAmount}, '${user.email}')">Proceder al Pago</button>
        `
    }
}

async function decreaseQuantity(cartId, pid, quantity) {
    if (quantity === 1) {
        Swal.fire({
            toast: true,
            title: "Cantidad mínima alcanzada",
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
        fetch(`/api/carts/${cartId}/product/${pid}/quantity/decrease`, {
            method: 'put'
        })
        .then(response => response.json())
        .then(() => {
            showCart()
        })
    }
}

async function increaseQuantity(cartId, pid, stock, quantity) {
    if (quantity >= stock) {
        Swal.fire({
            toast: true,
            title: "No hay mas stock disponible",
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
        fetch(`/api/carts/${cartId}/product/${pid}/quantity/increase`, {
            method: 'PUT'
        })
        .then(response => response.json())
        .then(() => {
            showCart()
        })
    }
}

async function deleteProduct(cartId, pid) {
    const cartCount = document.getElementById('cart-count')
    fetch(`/api/carts/${cartId}/product/${pid}`, {
        method: 'PUT'
    })
    .then(response => response.json())
    .then(async () => {
        response = await fetch(`/api/carts/${cartId}`, {
            method: 'GET',
        })

        data = await response.json()
        cartCount.innerHTML =  ` (${data.cart.products.length})`
        showCart()
    })
}

async function loadCheckOutModal(cid, amount, purchaser) {
    const { value: deliveryMethod, isConfirmed } = await Swal.fire({
        title: "¿Donde desea recibir su pedido?",
        input: "radio",
        inputOptions: {
            "Local": "Retirar en el local",
            "Domicilio": "Enviar a domicilio"
        },
        allowOutsideClick: false,
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return "Por favor, selecciona una opcion"
            }
        }
    })

    if (!isConfirmed) return

    if (deliveryMethod === "Domicilio") {
        const { isConfirmed: addressConfirmed } = await Swal.fire({
            title: 'Dirección de Envio',
            html: `
                <div style="display: flex; flex-direction: column; gap: 1rem">
                    <div style="display: flex; flex-direction: column;">
                        <label for="Provincia" style="margin-right: auto">Provincia *</label>
                        <input type="text" id="Provincia" class="swal2-input" style="margin: 0">
                    </div>
                    <div style="display: flex; flex-direction: column;">
                        <label for="Localidad" style="margin-right: auto">Localidad *</label>
                        <input type="text" id="Localidad" class="swal2-input" style="margin: 0">
                    </div>
                    <div style="display: flex; flex-direction: column;">
                        <label for="Calle" style="margin-right: auto">Calle *</label>
                        <input type="text" id="Calle" class="swal2-input" style="margin: 0">
                    </div>
                    <div style="display: flex; flex-direction: column;">
                        <label for="Numero" style="margin-right: auto">Numero *</label>
                        <input type="number" id="Numero" class="swal2-input" style="margin: 0">
                    </div>
                    <div style="display: flex; flex-direction: column;">
                        <label for="Piso" style="margin-right: auto">Piso</label>
                        <input type="number" id="Piso" class="swal2-input" style="margin: 0">
                    </div>
                    <div style="display: flex; flex-direction: column;">
                        <label for="Departamento" style="margin-right: auto">Departamento</label>
                        <input type="text" id="Departamento" class="swal2-input" style="margin: 0">
                    </div>
                    <div style="display: flex; flex-direction: column;">
                        <label for="Detalles" style="margin-right: auto">Detalles / Observaciones</label>
                        <textarea id="Detalles" class="swal2-textarea" style="margin: 0; resize: none"></textarea>
                    </div>
                </div>
            `,
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: 'Siguiente',
            preConfirm: () => {
                const Provincia = Swal.getPopup().querySelector('#Provincia').value
                const Localidad = Swal.getPopup().querySelector('#Localidad').value
                const Calle = Swal.getPopup().querySelector('#Calle').value
                const Numero = Swal.getPopup().querySelector('#Numero').value
    
                if (!Provincia || !Localidad || !Calle || !Numero) {
                    Swal.showValidationMessage('Provincia, Localidad, Calle y Numero son obligatorios')
                    return false
                }
            },
        })

        if (!addressConfirmed) return

    }

    const { isConfirmed: paymentConfirmed } = await Swal.fire({
        title: 'Metodo de Pago',
        html: `
            <div style="display: flex; flex-direction: column; gap: 1rem">
                <div style="display: flex; flex-direction: column;">
                    <label for="Metodo" style="margin-right: auto">Metodo de Pago</label>
                    <select id="Metodo" class="swal2-select" style="margin: 0">
                        <option>Visa</option>
                        <option>Mastercard</option>
                    </select>
                </div>
                <div style="display: flex; flex-direction: column;">
                    <label for="Tarjeta" style="margin-right: auto">Numero de la Tarjeta</label>
                    <input type="number" id="Tarjeta" class="swal2-input" style="margin: 0">
                </div>
                <div style="display: flex; flex-direction: column;">
                    <label for="Titular" style="margin-right: auto">Titular de la Tarjeta</label>
                    <input type="text" id="Titular" class="swal2-input" style="margin: 0">
                </div>
                <div style="display: flex; flex-direction: column;">
                    <label for="Vencimiento" style="margin-right: auto">Fecha de Vencimiento</label>
                    <input type="date" id="Vencimiento" class="swal2-input" style="margin: 0">
                </div>
                <div style="display: flex; flex-direction: column;">
                    <label for="Codigo" style="margin-right: auto">Codigo de Seguridad</label>
                    <input type="number" id="Codigo" class="swal2-input" style="margin: 0">
                </div>
            </div>
        `,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Finalizar Compra',
        preConfirm: () => {
            const Metodo = Swal.getPopup().querySelector('#Metodo').value
            const Tarjeta = Swal.getPopup().querySelector('#Tarjeta').value
            const Titular = Swal.getPopup().querySelector('#Titular').value
            const Vencimiento = Swal.getPopup().querySelector('#Vencimiento').value
            const Codigo = Swal.getPopup().querySelector('#Codigo').value
    
            if (!Metodo || !Tarjeta || !Titular || !Vencimiento || !Codigo) {
                Swal.showValidationMessage('Todos los campos son obligatorios')
                return false
            }
        },
    })

    if (!paymentConfirmed) return

    const code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const purchase_date = new Date()
    

    const response = await fetch(`/api/carts/${cid}/purchase`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: code,
            purchase_date: purchase_date,
            amount: amount,
            purchaser: purchaser
        })
    })

    if (response.ok) {
        Swal.fire({
            icon: 'success',
            title: '¡Compra Realizada!',
            html: `
                <p>¡Gracias por tu compra!</p>
                <p>El código de tu compra es: <b>${code}</b></p>
                <p>¡Guardalo bien! Lo necesitarás para recibir tu pedido.</p>
            `,
        })
        .then(() => {
            window.location.href = '/cart'
        })
    }
}

async function verifyCartStock(cartId) {
    const response = await fetch(`/api/carts/${cartId}/products`, {
        method: 'GET'
    })
    const data = await response.json()
    const cart = data.cart

    for (const item of cart.products) {
        const stock = item.product.stock
        const quantity = item.quantity
        const title = item.product.title

        if (stock < quantity) {
            await Swal.fire({
                icon: 'error',
                title: 'Stock insuficiente',
                text: `El producto "${title}" no tiene el stock suficiente para realizar la compra. Reduce la cantidad o elimínalo del carrito para continuar.`,
            })
            return false
        }
    }

    return true
}

async function checkStockAndProceed(cartId, amount, email) {
    const stockIsValid = await verifyCartStock(cartId)
    if (!stockIsValid) return
    loadCheckOutModal(cartId, amount, email)
}

showCart()