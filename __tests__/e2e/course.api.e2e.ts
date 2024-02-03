// @ts-ignore
import request from 'supertest'
import {CreateCourseModel} from "../../src/features/courses/models/CreateCourseModel";
import {app} from "../../src/app";
import {HTTP_STATUSES} from "../../src/utils";
import {UpdateCourseModel} from "../../src/features/courses/models/UpdateCourseModel";
import {coursesTestManager} from "./utils/coursesTestManager";


const getRequest = () => {
    return request(app)
}
describe('tests for /course', () => {

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

    it(`-POST shouldn't create course with incorrect input data`, async () => {
        const newVar: CreateCourseModel = { title: '' };


        await coursesTestManager.createCourse(newVar, HTTP_STATUSES.BAD_REQUEST_400)

        await getRequest()
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    let createdCourse1: any = null;
   it(`+POST should create course with correct input data`, async () => {
       const newVar: CreateCourseModel = { title: 'new course' };

       const result = await coursesTestManager.createCourse(newVar);

       createdCourse1 = result.CreateCourse;

     await getRequest()
         .get('/courses')
         .expect(HTTP_STATUSES.OK_200, [createdCourse1])
   })

    let createdCourse2: any = null;
    it(`+POST create course with correct input data`, async () => {
        const newVar: CreateCourseModel = { title: 'new course 2' };

        const result = await coursesTestManager.createCourse(newVar);



        createdCourse2 = result.CreateCourse;


        await getRequest()
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2])
    })

    it(`-PUT shouldn't update course with incorrect input data`, async () => {
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