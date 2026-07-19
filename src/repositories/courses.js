const courses = [
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
]

const getNextId = () => Math.max(0, ...courses.map(({ id }) => id)) + 1

export default {
  all() {
    return courses
  },

  findById(id) {
    return courses.find((course) => course.id === Number(id))
  },

  create(courseData) {
    const course = {
      id: getNextId(),
      ...courseData,
    }

    courses.push(course)
    return course
  },
}
