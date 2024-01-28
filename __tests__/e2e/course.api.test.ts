// @ts-ignore
//s
import request from 'supertest'
import {CreateCourseModel} from "../../src/models/CreateCourseModel";
import {UpdateCourseModel} from "../../src/models/UpdateCourseModel";
import {app} from "../../src/app";
import {HTTP_STATUSES} from "../../src/utils";


const getRequest = () => {
    return request(app)
}
describe('/course', () => {

    beforeAll(async () => {
        await getRequest()
            .delete('/__test__/data')
    })
    //процедура подготовки данных перед тестами(зачистка)

    it('+GET should return code 200 and empty array', async () => {
       await getRequest()
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('+GET should return code 404 for not existing course', async () => {
        await getRequest()
            .get('/courses/1')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`-POST should'nt create course with incorrect input data`, async () => {
        const newVar: CreateCourseModel = { title: '' };

        await getRequest()
            .post('/courses')
            .send(newVar)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await getRequest()
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    let createdCourse1: any = null;
   it(`+POST should create course with correct input data`, async () => {
       const newVar: CreateCourseModel = { title: 'new course' };
       const createResponse = await getRequest()
         .post('/courses')
         .send(newVar)
         .expect(HTTP_STATUSES.CREATED_201)

       createdCourse1 = createResponse.body;

     expect(createdCourse1).toEqual({
         id: expect.any(Number),
         title: newVar.title
     })

     await getRequest()
         .get('/courses')
         .expect(HTTP_STATUSES.OK_200, [createdCourse1])
   })

    let createdCourse2: any = null;
    it(`+POST create course with correct input data`, async () => {
        const newVar: CreateCourseModel = { title: 'new course 2' };

        const createResponse = await getRequest()
            .post('/courses')
            .send(newVar)
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse2 = createResponse.body;

        expect(createdCourse2).toEqual({
            id: expect.any(Number),
            title: newVar.title
        })

        await getRequest()
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2])
    })

    it(`-PUT should'nt update course with incorrect input data`, async () => {
        const newVar: UpdateCourseModel = { title: '' };

        await getRequest()
            .put( '/courses/' + createdCourse1.id)
            .send(newVar)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await getRequest()
            .get( '/courses/' + createdCourse1.id)
            .expect(HTTP_STATUSES.OK_200, createdCourse1)
    })

    it(`+PUT should update course that not exist with`, async () => {
        const newVar: UpdateCourseModel = { title: 'good title' };

        await getRequest()
            .put( '/courses/' + -100)
            .send(newVar)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`+PUT should update course with correct input data`, async () => {
        let newVar: UpdateCourseModel = { title: 'good title' };

        await getRequest()
            .put( '/courses/' + createdCourse1.id)
            .send(newVar)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await getRequest()
            .get( '/courses/' + createdCourse1.id)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdCourse1,
                title: newVar.title
            })

        await getRequest()
            .get( '/courses/' + createdCourse2.id)
            .expect(HTTP_STATUSES.OK_200, createdCourse2
            )
    })

    it('+DELETE both courses', async() => {
        await getRequest()
            .delete('/courses/' + createdCourse1.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await getRequest()
            .get('/courses/' + createdCourse1.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await getRequest()
            .delete('/courses/' + createdCourse2.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await getRequest()
            .get('/courses/' + createdCourse2.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await getRequest()
            .get('/courses/')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    afterAll(done => {
        done()
    })
})