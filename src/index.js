import fastify from 'fastify'

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

  return app
}
