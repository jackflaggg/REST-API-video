// пишем сюда те тесты, которые будут дублироваться
import {RouterPaths} from "../../../src/app";
import {HTTP_STATUSES, HttpStatusType} from "../../../src/utils";
import {getRequest} from "../users.api.e2e";
import {
    CreateUserCourseBindingModel
} from "../../../src/features/users-courses-bindings/models/CreateUserCourseBindingModel";




export const usersCoursesBindingsTestManager = {
    async createBinding(newVar: CreateUserCourseBindingModel, expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        // newVar - это то, что будет пересоздаваться

        const response = await getRequest()
            .post(RouterPaths.users)
            .send(newVar)
            .expect(expectedStatusCode)

        let Createdentity;

        if (expectedStatusCode === HTTP_STATUSES.CREATED_201){
            Createdentity = response.body;

            expect(Createdentity).toEqual({
                userId: newVar.userId,
                courseId: newVar.courseId,
                userName: expect.any(String),
                courseName: expect.any(String)
            })
        }



        return {response, Createdentity};
    }
}