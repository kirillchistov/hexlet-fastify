import fastify from 'fastify'
import formbody from '@fastify/formbody'
import view from '@fastify/view'
import pug from 'pug'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import userRepository from './repositories/users.js'
import courseRepository from './repositories/courses.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async () => {
  const app = fastify()

  await app.register(formbody)

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
    reply.view('users/index', {
      title: 'Пользователи',
      users: userRepository.all(),
    })
  })

  app.post('/users', (req, reply) => {
    const user = {
      name: (req.body.name || '').trim(),
      email: req.body.email.trim().toLowerCase(),
      password: req.body.password,
    }

    userRepository.create(user)
    reply.redirect('/users')
  })

  app.get('/hello', (req, reply) => {
    const name = req.query.name || 'World'
    reply.send(`Hello, ${name}!`)
  })

  app.get('/users/new', (req, reply) => {
    reply.view('users/new', { title: 'Новый пользователь' })
  })

  app.get('/users/show', (req, reply) => {
    reply.view('users/show', {
      title: 'Пользователь',
      userId: req.query.userId || '',
    })
  })

  app.get('/users/:id', (req, reply) => {
    const user = userRepository.findById(req.params.id)

    if (!user) {
      reply.code(404).send({ message: 'User not found' })
      return
    }

    reply.send(user)
  })

  app.get('/users/:id/post/:postId', (req, reply) => {
    reply.send(`User ID: ${req.params.id}; Post ID: ${req.params.postId}`)
  })

  app.get('/courses/new', (req, reply) => {
    reply.view('courses/new', { title: 'Новый курс' })
  })

  app.post('/courses', (req, reply) => {
    const course = {
      title: req.body.title.trim(),
      description: req.body.description.trim(),
    }

    courseRepository.create(course)
    reply.redirect('/courses')
  })

  app.get('/courses', (req, reply) => {
    const term = req.query.term ?? null
    const descriptionTerm = req.query.descriptionTerm ?? null

    let courses = courseRepository.all()

    if (term !== null && term !== '') {
      const normalizedTerm = term.toLowerCase()
      courses = courses.filter(({ title }) =>
        title.toLowerCase().includes(normalizedTerm),
      )
    }

    if (descriptionTerm !== null && descriptionTerm !== '') {
      const normalizedDescriptionTerm = descriptionTerm.toLowerCase()
      courses = courses.filter(({ description }) =>
        description.toLowerCase().includes(normalizedDescriptionTerm),
      )
    }

    reply.view('courses/index', {
      title: 'Курсы',
      term: term ?? '',
      descriptionTerm: descriptionTerm ?? '',
      courses,
      header: 'Курсы по программированию',
    })
  })

  app.get('/courses/:id', (req, reply) => {
    const course = courseRepository.findById(req.params.id)

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
