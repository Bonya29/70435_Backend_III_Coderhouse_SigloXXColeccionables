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
                    <div class="price-stock">
                        <p class="card-text price">$${product.price}</p>
                        <p class="card-text stock">Disponibles: ${product.stock}</p>
                    </div>
                </div>
            </div>
        `
    })
}

showProducts()