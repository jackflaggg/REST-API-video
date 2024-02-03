import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../../types";
import express, {Response} from "express";
import {CourseType, DBType, UserCourseBindingsType, UserType} from "../../db/db";
import {HTTP_STATUSES} from "../../utils";
import {UserCourseBindingAPIModel} from "./models/UserCourseBindingAPIModel";
import {CreateUserCourseBindingModel} from "./models/CreateUserCourseBindingModel";


export function getUserViewModel(dbUser: UserCourseBindingsType, user: UserType, course: CourseType): UserCourseBindingAPIModel {
    return {
        userId: dbUser.userId,
        courseId: dbUser.courseId,
        userName: user.userName,
        courseName: course.title,
    }
}

export const getUsersCoursesBindingsRouter = (db: DBType) => {
    const router = express.Router();


    router.post('/', (req: RequestWithBody<CreateUserCourseBindingModel>,
                      res: Response<UserCourseBindingAPIModel>) => {

        const user = db.users.find(u => u.id === req.body.userId);
        const course = db.courses.find(c => c.id === req.body.courseId);

        if (!user || !course){
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }

        const alreadyExistedBinding = db
            .userCourseBindings
            .find(b => b.userId === user.id && b.courseId === course.id);

        if (!!alreadyExistedBinding){
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }

        const cratedUser: UserCourseBindingsType = {
            userId: user.id,
            courseId: course.id,
            date: new Date()
        };
        db.userCourseBindings.push(cratedUser);
        //положили в бд

        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(getUserViewModel(cratedUser, user, course));
    });


    return router;
}
