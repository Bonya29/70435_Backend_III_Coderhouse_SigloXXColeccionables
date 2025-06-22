function ageRange() {
    const rangeInput = document.getElementById('ageRange')
    const rangeOutput = document.getElementById('ageValue')

    rangeOutput.textContent = rangeInput.value;

    rangeInput.addEventListener('input', function() {
        rangeOutput.textContent = this.value;
    })
}

function showPassword() {
    const passwordInput = document.getElementById('password')
    const repeatPasswordInput = document.getElementById('repassword')
    const check = document.getElementById('showPasswordCheck')
    check.addEventListener('change', function() {
        const type = this.checked ? 'text' : 'password'
        passwordInput.type = type
        repeatPasswordInput.type = type
    })
}

function preventDefaultInputs() {
    document.querySelector('form').addEventListener('submit', async function(e) {
        e.preventDefault()

        document.getElementById('firstNameError').textContent = ''
        document.getElementById('lastNameError').textContent = ''
        document.getElementById('genderError').textContent = ''
        document.getElementById('ageError').textContent = ''
        document.getElementById('emailError').textContent = ''
        document.getElementById('passwordError').textContent = ''
        document.getElementById('repasswordError').textContent = ''

        let first_name = document.getElementById('first_name').value.trim()
        let last_name = document.getElementById('last_name').value.trim()
        let gender = document.getElementById('gender').value.trim()
        let age = document.getElementById('ageRange').value.trim()
        let email = document.getElementById('email').value.trim()
        let password = document.getElementById('password').value.trim()
        let repassword = document.getElementById('repassword').value.trim()
        let hasError = false

        if (!first_name) {
            document.getElementById('firstNameError').innerHTML = `<i class="fa-regular fa-circle-xmark"></i> El campo es obligatorio.`
            hasError = true
        }
        if (!last_name) {
            document.getElementById('lastNameError').innerHTML = `<i class="fa-regular fa-circle-xmark"></i> El campo es obligatorio.`
            hasError = true
        }
        if (!gender) {
            document.getElementById('genderError').innerHTML = `<i class="fa-regular fa-circle-xmark"></i> El campo es obligatorio.`
            hasError = true
        }
        if (!age) {
            document.getElementById('ageError').innerHTML = `<i class="fa-regular fa-circle-xmark"></i> El campo es obligatorio.`
            hasError = true
        }
        if (!email) {
            document.getElementById('emailError').innerHTML = `<i class="fa-regular fa-circle-xmark"></i> El campo es obligatorio.`
            hasError = true
        }
        if (!password) {
            document.getElementById('passwordError').innerHTML = `<i class="fa-regular fa-circle-xmark"></i> El campo es obligatorio.`
            hasError = true
        }
        if (!repassword) {
            document.getElementById('repasswordError').innerHTML = `<i class="fa-regular fa-circle-xmark"></i> El campo es obligatorio.`
            hasError = true
        }
        if (hasError) return

        registerUser()
    })
}

async function registerUser() {
    let first_name = document.getElementById('first_name').value
    let last_name = document.getElementById('last_name').value
    let gender = document.getElementById('gender').value
    let age = document.getElementById('ageRange').value
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    let repassword = document.getElementById('repassword').value
    if (!first_name || !last_name || !age || !email || !password || !repassword) {
        return Swal.fire({
            title: "Campos Incompletos",
            text: "Todos los campos son obligatorios.",
            icon: "error",
        })
    }

    if (age < 13) {
        return Swal.fire({
            title: "Edad Insuficiente",
            text: "Lo sentimos, debes ser mayor de 13 años para registrarte.",
            icon: "error",
        })
    }

    if (email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)) {
        return Swal.fire({
            title: "Email Invalido",
            text: "Por favor, ingresa un email valido.",
            icon: "error",
        })
    }

    if (password !== repassword) {
        return Swal.fire({
            title: "Contraseñas No Coinciden",
            text: "Las contraseñas ingresadas no coinciden.",
            icon: "error",
        })
    }

    let userData = { first_name, last_name, gender, age, email, password }
    try {
        let response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        })

        if (!response.ok) {
            let errorData = await response.json()
            throw new Error(errorData.error)
        }

        Swal.fire({
            title: "Cuenta Creada",
            text: "Tu cuenta ha sido creada con exito, ahora puedes iniciar sesión.",
            icon: "success",
        })
        .then(() => {
            window.location.href = '/login'
        })
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
        })
        console.error("Error en el registro:", error)
    }
}

ageRange()
showPassword()
preventDefaultInputs()