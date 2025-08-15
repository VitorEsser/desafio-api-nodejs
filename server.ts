import fastify from 'fastify'
import crypto from 'node:crypto'

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
})

const courses = [
  { id: '1', title: 'Curso de Node.js' },
  { id: '2', title: 'Curso de React' },
  { id: '3', title: 'Curso de React Native' },
]

server.get('/courses', (request, reply) => {
  return reply.send({ courses })
})

server.get('/courses/:id', (request, reply) => {
  type Params = {
    id: string
  }

  const params = request.params as Params
  const courseID = params.id

  const course = courses.find((course) => course.id === courseID)

  if (course) {
    return reply.send({ course })
  }

  return reply.status(404).send()
})

server.post('/courses', (request, reply) => {
  type Body = {
    title: string
  }
  const body = request.body as Body

  const courseID = crypto.randomUUID()
  const courseTitle = body.title

  if (!courseTitle) {
    return reply.status(400).send({ message: 'Título obrigatório.' })
  }

  courses.push({ id: courseID, title: courseTitle })

  return reply.status(201).send({ courseID })
})

server.patch('/courses/:id', (request, reply) => {
  type Params = {
    id: string
  }

  type Body = {
    title: string
  }

  const body = request.body as Body
  const params = request.params as Params

  const courseID = params.id
  const courseTitle = body.title

  if (!courseTitle) {
    return reply.status(400).send({ message: 'Título obrigatório.' })
  }

  const course = courses.find((course) => course.id === courseID)

  if (course) {
    course.title = courseTitle
    return reply.status(200).send({ course })
  }

  return reply.status(404).send()
})

server.delete('/courses/:id', (request, reply) => {
  type Params = {
    id: string
  }

  const params = request.params as Params
  const courseID = params.id

  const index = courses.findIndex((course) => course.id === courseID)
  if (index !== -1) {
    courses.splice(index, 1)
    return reply.status(200).send()
  }

  return reply.status(404).send()
})

server.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!')
})
