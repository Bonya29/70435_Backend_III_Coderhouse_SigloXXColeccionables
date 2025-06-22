async function showUserData() {
    const userDataContainer = document.getElementById('userData')
    const userActionsContainer = document.getElementById('userActions')

    const response = await fetch('/api/users/current', {
        method: 'GET',
        credentials: 'include'
    })

    const data = await response.json()
    const user = data.user
    console.log(user)

    userDataContainer.innerHTML = `
        <div class="card shadow profile-card">
            <ul class="list-group list-group-flush">
                <li class="list-group-item active">Usuario<br>${user.first_name + ' ' + user.last_name}</li>
                <li class="list-group-item">Email<br>${user.email}</li>
                <li class="list-group-item">Genero<br>${user.gender}</li>
                <li class="list-group-item">Edad<br>${user.age}</li>
                <li class="list-group-item">Tipo de Cuenta<br>${user.role}</li>
            </ul>
        </div>
    `

    userActionsContainer.innerHTML = `
        <button type="button" class="btn btn-primary" onclick="logout()">Cerrar Sesion</button>
        <button type="button" class="btn btn-danger" onclick="deleteUser()">Eliminar Cuenta</button>
    `

}

async function logout() {
    await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include'
    })
    .then(() => window.location.href = '/login')
}

async function deleteUser() {
    const response = await fetch('/api/users/current', {
        method: 'GET',
        credentials: 'include'
    })

    const data = await response.json()
    const user = data.user
    
    Swal.fire({
        title: "Confirmar Eliminación",
        html: `¿Estas seguro que quieres eliminar tu cuenta?<br>Se borraran todos tus datos.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar"
    })
    .then(async (result) => {
        if (result.isConfirmed) {
            await fetch(`/api/users/deleteAccount/${user.id}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            .then(() => Swal.fire({
                title: "¡Cuenta Eliminada!",
                text: "Tu cuenta ha sido eliminada con exito.",
                icon: "success"
                })
                .then(() => logout())
            )
        }
    })
}

document.addEventListener('DOMContentLoaded', showUserData)