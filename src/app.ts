import express, {Response} from "express";
import {CourseAPIModel} from "./models/CourseAPIModel";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "./types";
import {QueryCoursesModel} from "./models/QueryCoursesModel";
import {URIParamsCourseIdModel} from "./models/URIParamsCourseIdModel";
import {CreateCourseModel} from "./models/CreateCourseModel";
import {UpdateCourseModel} from "./models/UpdateCourseModel";

export const app = express();
export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
};
export const jsonBodyMiddleware = express.json();
export type CourseType = {
    id: number,
    title: string,
    studentsCount: number
}
export const db: { courses: CourseType[] } = {
    courses: [
        {id: 1, title: 'front-en', studentsCount: 10},
        {id: 2, title: 'back-end', studentsCount: 10},
        {id: 3, title: 'qa', studentsCount: 10},
        {id: 4, title: 'devops', studentsCount: 10}]
};

export function getCourseViewModel(dbCourse: CourseType): CourseAPIModel {
    return {
        id: dbCourse.id,
        title: dbCourse.title,
    }
}

app.use(jsonBodyMiddleware);

app.delete('/__test__/data', (req,
                              res) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
