// пишем сюда те тесты, которые будут дублироваться
import {RouterPaths} from "../../../src/app";
import {HTTP_STATUSES, HttpStatusType} from "../../../src/utils";
import {getRequest} from "../users.api.e2e";
import {CreateCourseModel} from "../../../src/features/courses/models/CreateCourseModel";


export const coursesTestManager = {
    async createCourse(newVar: CreateCourseModel, expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        // newVar - это то, что будет пересоздаваться

        const response = await getRequest()
            .post(RouterPaths.courses)
            .send(newVar)
            .expect(expectedStatusCode)

        let CreateCourse;

        if (expectedStatusCode === HTTP_STATUSES.CREATED_201){
            CreateCourse = response.body;

            expect(CreateCourse).toEqual({
                id: expect.any(Number),
                title: newVar.title
            })
        }



        return {response: response, CreateCourse: CreateCourse};
    }
}