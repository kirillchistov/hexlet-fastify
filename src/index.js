import fastify from 'fastify'
import view from '@fastify/view'
import pug from 'pug'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const state = {
  users: [
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
    },
    {
      id: 3,
      name: 'user3',
      email: 'user3@example.com',
      password: 'password',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  courses: [
    {
      id: 1,
      title: 'JS: Массивы',
      description: 'Курс про массивы в JavaScript',
    },
    {
      id: 2,
      title: 'JS: Функции',
      description: 'Курс про функции в JavaScript',
    },
  ],
}

export default async () => {
  const app = fastify()

  await app.register(view, {
    engine: { pug },
    root: path.join(__dirname, 'views'),
    options: {
      pretty: true,
    },
  })

  app.get('/', (req, reply) => {
    reply.view('index', { title: 'Главная' })
  })

  app.get('/users', (req, reply) => {
    reply.send('GET /users')
  })

  app.post('/users', (req, reply) => {
    reply.send('POST /users')
  })

  app.get('/hello', (req, reply) => {
    const name = req.query.name || 'World'
    reply.send(`Hello, ${name}!`)
  })

  app.get('/users/new', (req, reply) => {
    reply.send('User build')
  })

  app.get('/users/:id', (req, reply) => {
    const { id } = req.params
    const user = state.users.find((user) => user.id === parseInt(id, 10))

    if (!user) {
      reply.code(404).send({ message: 'User not found' })
      return
    }

    reply.send(user)
  })

  app.get('/users/:id/post/:postId', (req, reply) => {
    reply.send(`User ID: ${req.params.id}; Post ID: ${req.params.postId}`)
  })

  app.get('/courses', (req, reply) => {
    reply.view('courses/index', {
      title: 'Курсы',
      courses: state.courses,
      header: 'Курсы по программированию',
    })
  })

  app.get('/courses/:id', (req, reply) => {
    const { id } = req.params
    const course = state.courses.find(({ id: courseId }) => courseId === parseInt(id, 10))

    if (!course) {
      reply.code(404).send({ message: 'Course not found' })
      return
    }

    reply.view('courses/show', {
      title: course.title,
      course,
    })
  })

  return app
}
