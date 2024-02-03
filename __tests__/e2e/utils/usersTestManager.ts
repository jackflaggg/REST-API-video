// пишем сюда те тесты, которые будут дублироваться
import {RouterPaths} from "../../../src/app";
import {HTTP_STATUSES, HttpStatusType} from "../../../src/utils";
import {getRequest} from "../users.api.e2e";
import {CreateUserModel} from "../../../src/features/users/models/CreateUserModel";



export const usersTestManager = {
    async createUser(newVar: CreateUserModel, expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        // newVar - это то, что будет пересоздаваться

        const response = await getRequest()
            .post(RouterPaths.users)
            .send(newVar)
            .expect(expectedStatusCode)

        let Createdentity;

        if (expectedStatusCode === HTTP_STATUSES.CREATED_201){
            Createdentity = response.body;

            expect(Createdentity).toEqual({
                id: expect.any(Number),
                userName: newVar.userName
            })
        }



        return {response, Createdentity};
    }
}