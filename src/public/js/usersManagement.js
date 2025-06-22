async function showUsers() {
    const response = await fetch('/api/users')
    const data = await response.json()
    const users = data.users

    const usersContainer = document.getElementById('users')
    users.forEach(user => {
        usersContainer.innerHTML += `
        <div class="card shadow profile-card">
            <ul class="list-group list-group-flush">
                <li class="list-group-item active">Usuario<br>${user.full_name}</li>
                <li class="list-group-item">Email<br>${user.email}</li>
                <li class="list-group-item">Genero<br>${user.gender}</li>
                <li class="list-group-item">Edad<br>${user.age}</li>
                <li class="list-group-item">Tipo de Cuenta<br>${user.role}</li>
            </ul>
            <div class="container d-flex justify-content-center card-body">
                <button class="btn btn-danger" onclick="deleteUser('${user._id}', '${user.role}')">Eliminar</button>
            </div>
        `
    })
}

async function deleteUser(userId, userRole) {
    if (userRole === 'admin') {
        Swal.fire({
            title: 'Error',
            text: "No puedes eliminar un usuario administrador.",
            icon: 'error',
            confirmButtonText: 'Aceptar'
        })
        return
    }

    Swal.fire({
        title: 'Confirmar Eliminación',
        text: "Se borraran todos los datos guardados del usuario y no podra volver a iniciar sesión.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar usuario'
    })
    .then(async (result) => {
        if (result.isConfirmed) {
            await fetch(`/api/users/deleteAccount/${userId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            .then(() => Swal.fire({
                title: "Usuario Eliminado!",
                text: "El usuario ha sido eliminado correctamente.",
                icon: "success"
                })
                .then(() => window.location.reload())
            )
        }
    })

}


showUsers()