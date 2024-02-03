// @ts-ignore
import request from 'supertest'
import {app, RouterPaths} from "../../src/app";
import {HTTP_STATUSES} from "../../src/utils";
import {usersTestManager} from "./utils/usersTestManager";
import {usersCoursesBindingsTestManager} from "./utils/usersCoursesBindingsTestManager";
import {
    CreateUserCourseBindingModel
} from "../../src/features/users-courses-bindings/models/CreateUserCourseBindingModel";


export const getRequest = () => {
    return request(app)
}

usersTestManager
describe('tests for /users-courses-bindings', () => {

    beforeAll(async () => {
        await getRequest()
            .delete(`${RouterPaths.__test__}/data`)
    })
    //процедура подготовки данных перед тестами(зачистка)


    it(`+POST should create entity with correct input data`, async () => {
        const createdUserResult = await usersTestManager.createUser({userName: 'dimych'})
        const createdCourseResult = await usersTestManager.createUser({userName: 'front-end'})

        const newVar: CreateUserCourseBindingModel = {
            userId: createdUserResult.Createdentity.id,
            courseId: createdCourseResult.Createdentity.id };

        await usersCoursesBindingsTestManager.createBinding(newVar, HTTP_STATUSES.BAD_REQUEST_400)

    })



    afterAll(done => {
        done()
    })
})