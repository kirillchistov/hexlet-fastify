const users = [
  {
    id: 1,
    name: 'user',
    email: 'user@example.com',
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'user2',
    email: 'user2@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: 'user3',
    email: 'user3@example.com',
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const getNextId = () => Math.max(0, ...users.map(({ id }) => id)) + 1

export default {
  all() {
    return users
  },

  findById(id) {
    return users.find((user) => user.id === Number(id))
  },

  create(userData) {
    const now = new Date()
    const user = {
      id: getNextId(),
      ...userData,
      createdAt: now,
      updatedAt: now,
    }

    users.push(user)
    return user
  },
}
