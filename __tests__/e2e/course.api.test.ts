import request from 'supertest'
import {app, db, HTTP_STATUSES} from "../../src";
import {CreateCourseModel} from "../../src/models/CreateCourseModel";

describe('/course', () => {

    beforeAll(async () => {
        await request(app)
            .delete('/__test__/data')
    })
    //процедура подготовки данных перед тестами(зачистка)

    it('+GET should return code 200 and empty array', async () => {
       await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('+GET should return code 404 for not existing course', async () => {
        await request(app)
            .get('/courses/1')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`-POST should'nt create course with incorrect input data`, async () => {
        const newVar: CreateCourseModel = { title: 'new course' };

        await request(app)
            .post('/courses')
            .send(newVar)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    let createdCourse1: any = null;
   it(`+POST should create course with correct input data`, async () => {
       const newVar: CreateCourseModel = { title: 'new course' };
       const createResponse = await request(app)
         .post('/courses')
         .send(newVar)
         .expect(HTTP_STATUSES.CREATED_201)

       createdCourse1 = createResponse.body;

     expect(createdCourse1).toEqual({
         id: expect.any(Number),
         title: 'new course'
     })

     await request(app)
         .get('/courses')
         .expect(HTTP_STATUSES.OK_200, [createdCourse1])
   })

    let createdCourse2: any = null;
    it(`+POST create course with correct input data`, async () => {
        const createResponse = await request(app)
            .post('/courses')
            .send({ title: 'new course 2' })
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse2 = createResponse.body;

        expect(createdCourse2).toEqual({
            id: expect.any(Number),
            title: 'new course 2'
        })

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2])
    })

    it(`-PUT should'nt update course with incorrect input data`, async () => {
        await request(app)
            .put( '/courses/' + createdCourse1.id)
            .send({title: ''})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get( '/courses/' + createdCourse1.id)
            .expect(HTTP_STATUSES.OK_200, createdCourse1)
    })

    it(`+PUT should update course that not exist with`, async () => {
        await request(app)
            .put( '/courses/' + -100)
            .send({title: 'good title'})
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`+PUT should update course with correct input data`, async () => {
        await request(app)
            .put( '/courses/' + createdCourse1.id)
            .send({title: 'good new title'})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get( '/courses/' + createdCourse1.id)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdCourse1,
                title: 'good new title'
            })

        await request(app)
            .get( '/courses/' + createdCourse2.id)
            .expect(HTTP_STATUSES.OK_200, createdCourse2
            )
    })

    it('+DELETE both courses', async() => {
        await request(app)
            .delete('/courses/' + createdCourse1.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get('/courses/' + createdCourse1.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .delete('/courses/' + createdCourse2.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get('/courses/' + createdCourse2.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get('/courses/')
            .expect(HTTP_STATUSES.OK_200, [])
    })
})