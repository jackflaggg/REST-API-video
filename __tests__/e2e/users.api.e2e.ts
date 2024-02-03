// @ts-ignore
import request from 'supertest'
import {app, RouterPaths} from "../../src/app";
import {HTTP_STATUSES} from "../../src/utils";
import {CreateUserModel} from "../../src/features/users/models/CreateUserModel";
import {UpdateUserModel} from "../../src/features/users/models/UpdateUserModel";
import {usersTestManager} from "./utils/usersTestManager";


export const getRequest = () => {
    return request(app)
}

usersTestManager
describe('tests for /users', () => {

    beforeAll(async () => {
        await getRequest()
            .delete(`${RouterPaths.__test__}/data`)
    })
    //процедура подготовки данных перед тестами(зачистка)

    it('+GET should return code 200 and empty array', async () => {
        await getRequest()
            .get(RouterPaths.users)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('+GET should return code 404 for not existing entity', async () => {
        await getRequest()
            .get(`${RouterPaths.users}/1`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`-POST shouldn't create entity with incorrect input data`, async () => {
        const newVar: CreateUserModel = { userName: '' };

        await usersTestManager.createUser(newVar, HTTP_STATUSES.BAD_REQUEST_400)

        await getRequest()
            .get(RouterPaths.users)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    let createdEntity1: any = null;
    it(`+POST should create entity with correct input data`, async () => {
        const newVar: CreateUserModel = { userName: 'dimych' };

        const {response, Createdentity} = await usersTestManager.createUser(newVar)


        createdEntity1 = Createdentity;

        await getRequest()
            .get(RouterPaths.users)
            .expect(HTTP_STATUSES.OK_200, [createdEntity1])
    })

    let createdEntity2: any = null;
    it(`+POST create entity with correct input data`, async () => {
        const newVar: CreateUserModel = { userName: 'rasul' };

        const {response, Createdentity} = await usersTestManager.createUser(newVar)

        createdEntity2 = Createdentity;

        await getRequest()
            .get(RouterPaths.users)
            .expect(HTTP_STATUSES.OK_200, [createdEntity1, createdEntity2])
    })

    it(`-PUT shouldn't update entity with incorrect input data`, async () => {
        const newVar: UpdateUserModel = { userName: '' };

        await getRequest()
            .put( `${RouterPaths.users}/${createdEntity1.id}`)
            .send(newVar)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await getRequest()
            .get( `${RouterPaths.users}/${createdEntity1.id}`)
            .expect(HTTP_STATUSES.OK_200, createdEntity1)
    })

    it(`+PUT should update entity that not exist with`, async () => {
        const newVar: UpdateUserModel = { userName: 'Andrey' };

        await getRequest()
            .put( `${RouterPaths.users}/${-100}`)
            .send(newVar)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`+PUT should update entity with correct input data`, async () => {
        let newVar: UpdateUserModel = { userName: 'dimych' };

        await getRequest()
            .put( `${RouterPaths.users}/${createdEntity1.id}`)
            .send(newVar)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await getRequest()
            .get( `${RouterPaths.users}/${createdEntity1.id}`)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdEntity1,
                userName: newVar.userName
            })

        await getRequest()
            .get( `${RouterPaths.users}/${createdEntity2.id}`)
            .expect(HTTP_STATUSES.OK_200, createdEntity2
            )
    })

    it('+DELETE both entitys', async() => {
        await getRequest()
            .delete(`${RouterPaths.users}/${createdEntity1.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await getRequest()
            .get(`${RouterPaths.users}/${createdEntity1.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await getRequest()
            .delete(`${RouterPaths.users}/${createdEntity2.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await getRequest()
            .get(`${RouterPaths.users}/${createdEntity2.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await getRequest()
            .get(RouterPaths.users)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    afterAll(done => {
        done()
    })
})