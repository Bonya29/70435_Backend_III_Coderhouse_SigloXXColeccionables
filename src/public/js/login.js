function showPassword() {
    const passwordInput = document.getElementById('password')
    const check = document.getElementById('showPasswordCheck')
    check.addEventListener('change', function() {
        const type = this.checked ? 'text' : 'password'
        passwordInput.type = type
    })
}

function preventDefaultInputs() {
    document.querySelector('form').addEventListener('submit', async function(e) {
        e.preventDefault()

        document.getElementById('emailError').textContent = ''
        document.getElementById('passwordError').textContent = ''

        let email = document.getElementById('email').value.trim()
        let password = document.getElementById('password').value.trim()
        let hasError = false

        if (!email) {
            document.getElementById('emailError').innerHTML = `<i class="fa-regular fa-circle-xmark"></i> El campo es obligatorio.`
            hasError = true
        }
        if (!password) {
            document.getElementById('passwordError').innerHTML = `<i class="fa-regular fa-circle-xmark"></i> El campo es obligatorio.`
            hasError = true
        }
        if (hasError) return

        userLogin()
    })
}

async function userLogin() {
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    let formData = { email, password }
    try {
        let response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })

        if (!response.ok) {
            let errorData = await response.json()
            throw new Error(errorData.error)
        }

        Swal.fire({
            title: "Login Exitoso",
            text: "Se ha iniciado sesión correctamente.",
            icon: "success"
        })
        .then(() => {
            window.location.href = '/home'
        })
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
        })
    }    
}

function showInfo() {
    Swal.fire({
        title: "Usuario Admin",
        html: "<br><b>Email:</b> admin1@example.com<br><br><b>Contraseña:</b> qwer1234",
        icon: "info"
    })
}

preventDefaultInputs()
showPassword()