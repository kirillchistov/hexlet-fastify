import fastify from 'fastify'
import formbody from '@fastify/formbody'
import view from '@fastify/view'
import pug from 'pug'
import yup from 'yup'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fastifyReverseRoutes from 'fastify-reverse-routes'
import routes from './routes.js'
import userRepository from './repositories/users.js'
import courseRepository from './repositories/courses.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async () => {
  const app = fastify({ exposeHeadRoutes: false })

  await app.register(formbody)
  await app.register(fastifyReverseRoutes.plugin)

  const route = (name, placeholdersValues) => app.reverse(name, placeholdersValues)

  await app.register(view, {
    engine: { pug },
    root: path.join(__dirname, 'views'),
    options: {
      pretty: true,
    },
    defaultContext: {
      route,
      routes,
    },
  })

  app.get(routes.rootPath(), { name: 'root' }, (req, res) => {
    res.view('index', { title: 'Главная' })
  })

  app.get(routes.usersPath(), { name: 'users' }, (req, res) => {
    res.view('users/index', {
      title: 'Пользователи',
      users: userRepository.all(),
    })
  })

  app.post(routes.usersPath(), {
    attachValidation: true,
    schema: {
      body: yup.object({
        name: yup.string().min(2, 'Имя должно быть не меньше двух символов'),
        email: yup.string().email(),
        password: yup.string().min(5),
        passwordConfirmation: yup.string().min(5),
      }),
    },
    validatorCompiler: ({ schema }) => (data) => {
      if (data.password !== data.passwordConfirmation) {
        return {
          error: Error('Password confirmation is not equal the password'),
        }
      }
      try {
        const result = schema.validateSync(data)
        return { value: result }
      }
      catch (e) {
        return { error: e }
      }
    },
  }, (req, res) => {
    const { name, email, password, passwordConfirmation } = req.body

    if (req.validationError) {
      res.view('users/new', {
        title: 'Новый пользователь',
        name,
        email,
        password,
        passwordConfirmation,
        error: req.validationError,
      })
      return
    }

    const user = {
      name: (req.body.name || '').trim(),
      email: req.body.email.trim().toLowerCase(),
      password: req.body.password,
    }

    userRepository.create(user)
    res.redirect(route('users'))
  })

  app.get(routes.helloPath(), { name: 'hello' }, (req, res) => {
    const name = req.query.name || 'World'
    res.send(`Hello, ${name}!`)
  })

  app.get(routes.newUserPath(), { name: 'newUser' }, (req, res) => {
    res.view('users/new', { title: 'Новый пользователь' })
  })

  app.get(routes.usersShowPath(), { name: 'usersShow' }, (req, res) => {
    res.view('users/show', {
      title: 'Пользователь',
      userId: req.query.userId || '',
    })
  })

  app.get(routes.userPath(':id'), { name: 'user' }, (req, res) => {
    const user = userRepository.findById(req.params.id)

    if (!user) {
      res.code(404).send({ message: 'User not found' })
      return
    }

    res.send(user)
  })

  app.get(routes.userPostPath(':id', ':postId'), { name: 'userPost' }, (req, res) => {
    res.send(`User ID: ${req.params.id}; Post ID: ${req.params.postId}`)
  })

  app.get(routes.newCoursePath(), { name: 'newCourse' }, (req, res) => {
    res.view('courses/new', { title: 'Новый курс' })
  })

  app.post(routes.coursesPath(), {
    attachValidation: true,
    schema: {
      body: yup.object({
        title: yup.string().min(2, 'Название должно быть не меньше двух символов'),
        description: yup.string().min(10, 'Описание должно быть не меньше 10 символов'),
      }),
    },
    validatorCompiler: ({ schema }) => (data) => {
      try {
        const result = schema.validateSync(data)
        return { value: result }
      }
      catch (e) {
        return { error: e }
      }
    },
  }, (req, res) => {
    const { title, description } = req.body

    if (req.validationError) {
      res.view('courses/new', {
        title: 'Новый курс',
        courseTitle: title,
        description,
        error: req.validationError,
      })
      return
    }

    const course = {
      title: req.body.title.trim(),
      description: req.body.description.trim(),
    }

    courseRepository.create(course)
    res.redirect(route('courses'))
  })

  app.get(routes.coursesPath(), { name: 'courses' }, (req, res) => {
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

    res.view('courses/index', {
      title: 'Курсы',
      term: term ?? '',
      descriptionTerm: descriptionTerm ?? '',
      courses,
      header: 'Курсы по программированию',
    })
  })

  app.get(routes.coursePath(':id'), { name: 'course' }, (req, res) => {
    const course = courseRepository.findById(req.params.id)

    if (!course) {
      res.code(404).send({ message: 'Course not found' })
      return
    }

    res.view('courses/show', {
      title: course.title,
      course,
    })
  })

  return app
}
