async function showUsers() {
    const response = await fetch('/api/users')
    const data = await response.json()
    const users = data.users

    const usersContainer = document.getElementById('users')
    users.forEach(user => {
        usersContainer.innerHTML += `
        <div class="card shadow" style="width: 18rem;">
            <ul class="list-group list-group-flush">
                <li class="list-group-item active">Usuario<br>${user.full_name}</li>
                <li class="list-group-item">Email<br>${user.email}</li>
                <li class="list-group-item">Genero<br>${user.gender}</li>
                <li class="list-group-item">Edad<br>${user.age}</li>
                <li class="list-group-item">Tipo de Cuenta<br>${user.role}</li>
            </ul>
        </div>
        `
    })
}

showUsers()