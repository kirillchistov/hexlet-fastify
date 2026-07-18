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
      title: 'Python-разработчик',
      description: 'Изучите Python, Django, REST и Fast API для создания веб-приложений',
    },
    {
      id: 2,
      title: 'Фронтенд-разработчик',
      description: 'Изучите HTML, CSS, JavaScript и React',
    },
    {
      id: 3,
      title: 'Java-разработчик',
      description: 'Изучите Java и фреймворк Spring Boot и REST API',
    },
    {
      id: 4,
      title: 'PHP-разработчик',
      description: 'Изучите PHP и Laravel для разработки и проектирования REST API',
    },
    {
      id: 5,
      title: 'Go-разработчик',
      description: 'Изучите Go, работу с БД, HTTP, конкурентность, горутины, многопоточность',
    },
    {
      id: 6,
      title: 'Node.js-разработчик',
      description: 'Изучите JavaScript, Node.js, Fastify и REST API',
    },
    {
      id: 7,
      title: 'Fullstack-разработчик на Node.js',
      description: 'Освоите JavaScript, Node.js, Fastify и React для фронтенда и бэкенда',
    },
    {
      id: 8,
      title: 'Веб-разработка на Fastify',
      description: 'Получите навык создания бэкенда и построения HTTP API',
    },
    {
      id: 9,
      title: 'Основы Python',
      description: 'Изучите синтаксис, переменные, функции',
    },
    {
      id: 10,
      title: 'Основы JavaScript',
      description: 'Изучите язык JavaScript и его практическое применение',
    },
    {
      id: 11,
      title: 'React',
      description: 'Освоите React и создание быстрых интерфейсов',
    },
    {
      id: 12,
      title: 'Django',
      description: 'Изучите фреймворк Django для создания веб-приложений',
    },
    {
      id: 13,
      title: 'Laravel',
      description: 'Изучите фреймворк Laravel для создания веб-приложений',
    },
    {
      id: 14,
      title: 'Spring Boot',
      description: 'Навык работы с Spring Boot для масштабируемых веб-приложений',
    },
    {
      id: 15,
      title: 'REST API в Node.js',
      description: 'Навык разработки высокопроизводительных API',
    },
    {
      id: 16,
      title: 'Typescript',
      description: 'Изучите Typescript и получите навык снижать ошибки, упрощать отладку',
    },
    {
      id: 17,
      title: 'Основы Go',
      description: 'Изучите основы Go, структуры, функции и горутины',
    },
    {
      id: 18,
      title: 'Веб-разработка на Express',
      description: 'Изучение микрофреймворка Express для создания веб-приложений на JavaScript',
    },
    {
      id: 19,
      title: 'Основы Java',
      description: 'Изучите базовые концепции: переменные, условия и циклы',
    },
    {
      id: 20,
      title: 'Основы PHP',
      description: 'Изучите основы PHP и создание простых веб-страниц',
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

  app.get('/users/show', (req, reply) => {
    reply.view('users/show', {
      title: 'Пользователь',
      userId: req.query.userId || '',
    })
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
    const term = req.query.term ?? null
    const descriptionTerm = req.query.descriptionTerm ?? null

    let courses = state.courses

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
