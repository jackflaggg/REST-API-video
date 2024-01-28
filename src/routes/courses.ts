import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../types";
import {QueryCoursesModel} from "../models/QueryCoursesModel";
import {Express, Response} from "express";
import {CourseAPIModel} from "../models/CourseAPIModel";
import {URIParamsCourseIdModel} from "../models/URIParamsCourseIdModel";
import {CreateCourseModel} from "../models/CreateCourseModel";
import {UpdateCourseModel} from "../models/UpdateCourseModel";
import {app, CourseType, db, getCourseViewModel, HTTP_STATUSES} from "../app";

export const addCoursesRoutes = (app: Express) => {
    app.get('/courses', (req: RequestWithQuery<QueryCoursesModel>,
                         res: Response<CourseAPIModel[]>) => {
        let foundCourses = db.courses;


        if (req.query.title){
            foundCourses = foundCourses
                .filter(cours => cours.title.indexOf(req.query.title) > -1);
        }

        res.json(foundCourses.map(getCourseViewModel))
    });

    app.get('/courses/:id', (req: RequestWithParams<URIParamsCourseIdModel>,
                             res: Response<CourseAPIModel>) => {
        const foundCourse = db.courses
            .find(cours => cours.id === +req.params.id);

        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.json(getCourseViewModel(foundCourse));
    })

    app.post('/courses', (req: RequestWithBody<CreateCourseModel>,
                          res: Response<CourseAPIModel>) => {

        if (!req.body.title){
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }

        const cratedCourse: CourseType = {
            id: +(new Date()),
            title: req.body.title,
            studentsCount: 0
        };
        db.courses.push(cratedCourse);
        //положили в бд

        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(getCourseViewModel(cratedCourse));
    });

    app.delete('/courses/:id', (req: RequestWithParams<URIParamsCourseIdModel>,
                                res) => {
        const courseId = +req.params.id;
        const courseIndex = db.courses.findIndex(course => course.id === courseId);

        if (courseIndex === -1) {
            // Если объект не существует, отправляем статус 404 Not Found
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        } else {
            // Если объект существует, выполняем его удаление
            db.courses = db.courses.filter(course => course.id !== courseId);
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        }
    });

    app.put('/courses/:id', (req: RequestWithParamsAndBody<URIParamsCourseIdModel, UpdateCourseModel>,
                             res) => {

        if(!req.body.title){
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }

        const foundCourse = db.courses
            .find(cours => cours.id === +req.params.id);

        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        foundCourse.title = req.body.title;

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });

}