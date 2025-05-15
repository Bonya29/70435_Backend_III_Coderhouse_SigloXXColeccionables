import { faker } from '@faker-js/faker'

export const generateMockUsers = async (count = 1) => {
    const users = []

    for (let i = 0; i < count; i++) {
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()
        const user = {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
            gender: faker.helpers.arrayElement(['Masculino', 'Femenino', 'N/A']),
            email: faker.internet.email({ firstName, lastName }),
            age: faker.number.int({ min: 13, max: 100 }),
            password: faker.internet.password(),
            cartId: faker.string.uuid(),
            role: 'user'
        }

        users.push(user)
    }

    return users
}