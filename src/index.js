import fastify from 'fastify'

const state = {
  users: [
    {
      id: 1,
      name: 'user',
    },
  ],
}

export default () => {
  const app = fastify()

  app.get('/users', (req, res) => {
    res.send('GET /users')
  })

  app.post('/users', (req, res) => {
    res.send('POST /users')
  })

  app.get('/hello', (req, res) => {
    const name = req.query.name || 'World'
    res.send(`Hello, ${name}!`)
  })

  app.get('/users/new', (req, res) => {
    res.send('User build')
  })

  app.get('/users/:id', (req, res) => {
    const { id } = req.params
    const user = state.users.find((user) => user.id === parseInt(id, 10))

    if (!user) {
      res.code(404).send({ message: 'User not found' })
      return
    }

    res.send(user)
  })

  app.get('/users/:id/post/:postId', (req, res) => {
    res.send(`User ID: ${req.params.id}; Post ID: ${req.params.postId}`)
  })

  return app
}
