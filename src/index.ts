import express, {Request, Response} from 'express'
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "./types";
import {CreateCourseModel} from "./models/CreateCourseModel";
import {QueryCoursesModel} from "./models/QueryCoursesModel";

export const app = express();
const port = 3000;

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
};

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

type CourseType = {
    id: number,
    title: string
}

export const db: { courses: CourseType[]} = {
    courses: [
        {id: 1, title: 'front-en'},
        {id: 2, title: 'back-end'},
        {id: 3, title: 'qa'},
        {id: 4, title: 'devops'}]
};

app.get('/courses', (req: RequestWithQuery<QueryCoursesModel>,
                     res: Response<CourseType[]>) => {
    let foundCourses = db.courses;


    if (req.query.title){
        foundCourses = foundCourses
            .filter(cours => cours.title.indexOf(req.query.title) > -1);
    }

    res.json(foundCourses);
});

app.get('/courses/:id', (req: RequestWithParams<{id: string}>,
                         res: Response) => {
    const foundCourse = db.courses
        .find(cours => cours.id === +req.params.id);

    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    res.json(foundCourse);
})

app.post('/courses', (req: RequestWithBody<CreateCourseModel>,
                                    res: Response<CourseType>) => {

    if (!req.body.title){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }

    const cratedCourse = {
        id: +(new Date()),
        title: req.body.title,
    };

    db.courses.push(cratedCourse);
    console.log(cratedCourse);
    //положили в бд
    res
        .status(HTTP_STATUSES.CREATED_201)
        .json(cratedCourse);
});

app.delete('/courses/:id', (req: RequestWithParams<{id: string}>,
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

app.put('/courses/:id', (req: RequestWithParamsAndBody<{id: string}, CreateCourseModel>,
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

app.delete('/__test__/data', (req,
                                            res) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.listen(port, () => {
    console.log('Port active: ' + port);
});