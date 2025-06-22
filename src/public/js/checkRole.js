async function checkRole() {
    const cart = document.getElementById('cart')
    const cartCount = document.getElementById('cart-count')
    const productsManagement = document.getElementById('productsManagement')
    const usersManagement = document.getElementById('usersManagement')
    const profile = document.getElementById('profile')
    const login = document.getElementById('login')

    cart.style.display = 'none'
    productsManagement.style.display = 'none'
    usersManagement.style.display = 'none'
    profile.style.display = 'none'
    login.style.display = 'block'

    const response = await fetch('/api/users/current', {
        method: 'GET',
        credentials: 'include'
    })

    const data = await response.json()
    const user = data.user

    if (user.role === 'admin') {
        productsManagement.style.display = 'block'
        usersManagement.style.display = 'block'
        profile.style.display = 'block'
        login.style.display = 'none'
    } else if (user.role === 'user') {
        cart.style.display = 'block'
        profile.style.display = 'block'
        login.style.display = 'none'
        
        const response = await fetch(`/api/carts/${user.cartId}`, {
            method: 'GET',
        })

        const data = await response.json()
        cartCount.innerHTML = ` (${data.cart.products.length})`
    }
}

document.addEventListener('DOMContentLoaded', checkRole)