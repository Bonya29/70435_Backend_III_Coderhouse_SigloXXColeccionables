async function showProducts() {
    const response = await fetch('/api/products')
    const data = await response.json()
    const products = data.products
    const productsContainer = document.getElementById('products')
    products.forEach(product => {
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
                <div class="d-flex justify-content-between mt-1">
                    <button class="btn btn-primary btn-sm" id="btnUpd-${product._id}" onclick="loadUpdateProductModal('${product._id}')">Actualizar</button>
                    <button class="btn btn-danger btn-sm" id="btnDel-${product._id}" onclick="deleteProduct('${product._id}')">Eliminar</button>
                </div>
            </div>
        </div>
        `
    })

    if (localStorage.getItem('scrollToBottom') === 'true') {
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
            localStorage.removeItem('scrollToBottom')
        }, 100)
    }
}

async function showProductFormModal() {
    const response = await fetch('/api/products')
    const data = await response.json()
    const products = data.products

    Swal.fire({
        title: 'Agregar Producto',
        html: `
            <div style="display: flex; flex-direction: column; gap: 1rem">
                <div style="display: flex; flex-direction: column;">
                    <label for="title" style="margin-right: auto">Titulo</label>
                    <input type="text" id="title" class="swal2-input" style="margin: 0">
                </div>
                <div style="display: flex; flex-direction: column;">
                    <label for="description" style="margin-right: auto">Descripcion</label>
                    <textarea id="description" class="swal2-textarea" style="margin: 0; resize: none"></textarea>
                </div>
                <div style="display: flex; flex-direction: column;">
                    <label for="price" style="margin-right: auto">Precio</label>
                    <input type="number" id="price" class="swal2-input" style="margin: 0">
                </div>
                <div style="display: flex; flex-direction: column;">
                    <label for="stock" style="margin-right: auto">Stock</label>
                    <input type="number" id="stock" class="swal2-input" style="margin: 0">
                </div>
                <div style="display: flex; flex-direction: column;">
                    <label for="category" style="margin-right: auto">Categoria</label>
                    <select id="category" class="swal2-select" style="margin: 0" onchange="updateCode()">
                        <option value="">Seleccionar Categoria</option>
                        <option value="Estampillas">Estampillas</option>
                        <option value="Billetes">Billetes</option>
                        <option value="Monedas">Monedas</option>
                        <option value="Maquetas">Maquetas</option>
                    </select>
                </div>
                <div style="display: flex; flex-direction: column;">
                    <label for="code" style="margin-right: auto">Codigo</label>
                    <input type="text" id="code" class="swal2-input" style="margin: 0">
                </div>
            </div>
        `,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Agregar Producto',
        preConfirm: () => {
            const title = document.getElementById('title').value.trim()
            const description = document.getElementById('description').value.trim()
            const price = document.getElementById('price').value.trim()
            const stock = document.getElementById('stock').value.trim()
            const category = document.getElementById('category').value
            const code = document.getElementById('code').value.trim()

            let existTitle = products.find(prod => prod.title.toLowerCase().replace(/\s+/g, "") === title.toLowerCase().replace(/\s+/g, ""))
            let existCode = products.find(prod => prod.code.toUpperCase().replace(/\s+/g, "") === code.toUpperCase().replace(/\s+/g, ""))

            if (!title || !description || !price || !stock || !category || !code) {
                Swal.showValidationMessage('Todos los campos son obligatorios')
                return false
            }
            if (existTitle) {
                Swal.showValidationMessage(`Ya existe un producto con el nombre "${title}"`)
                return false
            }
            if (existCode) {
                Swal.showValidationMessage(`Ya existe un producto con el código "${code}"`)
                return false
            }

            return {
                title,
                description,
                price,
                stock,
                category,
                code
            }
        }
    }).then(async (result) => {
        if (result.isConfirmed && result.value) {
            const { title, description, price, stock, category, code } = result.value
            let image = "/assets/noImageYet.png"
            let status = true

            let product = {
                image, title, description, price, stock, category, code, status
            }

            await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            })

            Swal.fire({
                title: "Producto Agregado",
                text: `El producto ha sido agregado con éxito`,
                icon: "success"
            })
            .then(() => {
                localStorage.setItem('scrollToBottom', 'true')
                window.location.reload()
            })
        }
    })
}

function updateCode() {
    const categoryPrefixes = {
        "Estampillas": "A",
        "Billetes": "B",
        "Monedas": "C",
        "Maquetas": "D"
    }

    const category = document.getElementById("category").value
    const codeInput = document.getElementById("code")

    if (categoryPrefixes[category]) {
        codeInput.value = categoryPrefixes[category]
    } else {
        codeInput.value = ""
    }
}

async function deleteProduct(productId) {
    const response = await fetch(`/api/products/${productId}`, {
        method: 'GET'
    })

    const data = await response.json()
    const product = data.product

    const title = product.title
    
    Swal.fire({
        title: "Confirmar Eliminación",
        text: `Estas por eliminar el producto ${title}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar"
    })
    .then((result) => {
        if (result.isConfirmed) {
            fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            })
            .then(() => Swal.fire({
                title: "Producto Eliminado!",
                text: "El producto a sido eliminado con exito",
                icon: "success"
                })
                .then(() => {
                    window.location.reload()
                })
            )
        }
    })
}

async function loadUpdateProductModal(productId) {
    const response = await fetch(`/api/products/${productId}`, {
        method: 'GET'
    })

    const data = await response.json()
    const product = data.product

    const sameTitle = product.title
    const sameCode = product.code
    const pid = product._id
    
    Swal.fire({
        title: 'Actualizar Producto',
        html: `
            <div style="display: flex; flex-direction: column; gap: 1rem">
                <div style="display: flex; flex-direction: column;">
                    <label for="title" style="margin-right: auto">Titulo</label>
                    <input type="text" id="title" class="swal2-input" style="margin: 0">
                </div>
                <div style="display: flex; flex-direction: column;">
                    <label for="description" style="margin-right: auto">Descripcion</label>
                    <textarea id="description" class="swal2-textarea" style="margin: 0; resize: none"></textarea>
                </div>
                <div style="display: flex; flex-direction: column;">
                    <label for="price" style="margin-right: auto">Precio</label>
                    <input type="number" id="price" class="swal2-input" style="margin: 0">
                </div>
                <div style="display: flex; flex-direction: column;">
                    <label for="stock" style="margin-right: auto">Stock</label>
                    <input type="number" id="stock" class="swal2-input" style="margin: 0">
                </div>
                <div style="display: flex; flex-direction: column;">
                    <label for="category" style="margin-right: auto">Categoria</label>
                    <select id="category" class="swal2-select" style="margin: 0" onchange="updateCode()">
                        <option value="">Seleccionar Categoria</option>
                        <option value="Estampillas">Estampillas</option>
                        <option value="Billetes">Billetes</option>
                        <option value="Monedas">Monedas</option>
                        <option value="Maquetas">Maquetas</option>
                    </select>
                </div>
                <div style="display: flex; flex-direction: column;">
                    <label for="code" style="margin-right: auto">Codigo</label>
                    <input type="text" id="code" class="swal2-input" style="margin: 0">
                </div>
            </div>
        `,
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: 'Actualizar Producto',
        didOpen: () => {
            document.getElementById('title').value = product.title || '';
            document.getElementById('description').value = product.description || '';
            document.getElementById('price').value = product.price || '';
            document.getElementById('stock').value = product.stock || '';
            document.getElementById('category').value = product.category || '';
            document.getElementById('code').value = product.code || '';
        },
        preConfirm: async () => {
            const title = document.getElementById('title').value.trim()
            const description = document.getElementById('description').value.trim()
            const price = document.getElementById('price').value.trim()
            const stock = document.getElementById('stock').value.trim()
            const category = document.getElementById('category').value
            const code = document.getElementById('code').value.trim()

            const response = await fetch('/api/products')
            const data = await response.json()
            const products = data.products

            let existTitle = products.find(prod => prod.title.toLowerCase().replace(/\s+/g, "") === title.toLowerCase().replace(/\s+/g, ""))
            let existCode = products.find(prod => prod.code.toUpperCase().replace(/\s+/g, "") === code.toUpperCase().replace(/\s+/g, ""))

            if (!title || !description || !price || !stock || !category || !code) {
                Swal.showValidationMessage('Todos los campos son obligatorios')
                return false
            }
            if (existTitle && sameTitle !== title) {
                Swal.showValidationMessage(`Ya existe un producto con el nombre "${title}"`)
                return false
            }
            if (existCode && sameCode !== code) {
                Swal.showValidationMessage(`Ya existe un producto con el código "${code}"`)
                return false
            }

            const updatedProduct = {
                title,
                description,
                price,
                stock,
                category,
                code
            }

            fetch(`/api/products/${pid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduct)
            })

            swal.fire({
                title: 'Producto Actualizado',
                text: `El producto ha sido actualizado con éxito`,
                icon: 'success'
            })
            .then(() => {
                window.location.reload()
            })
        }
    })
}

showProducts()