import { test, expect } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { makeCourse } from '../tests/factories/make-course.ts'

test('get course by id', async () => {
  await server.ready()

  const course = await makeCourse()

  const response = await request(server.server).get(`/courses/${course.id}`)

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    course: {
      id: expect.any(String),
      title: expect.any(String),
      description: null,
    },
  })
})

test('return 404 for non existing courses', async () => {
  await server.ready()

  const response = await request(server.server).get(
    `/courses/7196dea5-9670-488c-9928-cdaa9c334998`
  )

  expect(response.status).toEqual(404)
})
