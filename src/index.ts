import express from 'express'

export const app = express();
const port = 3000;

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST400: 400,
    NOT_FOUND: 404,
};

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

const db = {
    courses: [
        {id: 1, title: 'front-en'},
        {id: 2, title: 'back-end'},
        {id: 3, title: 'qa'},
        {id: 4, title: 'devops'}]
};

app.get('/courses', (req, res) => {
    let foundCourses = db.courses;

    if (req.query.title){
        foundCourses = foundCourses
            .filter(cours => cours.title.indexOf(req.query.title as string) > -1);
    }

    res.json(foundCourses);
});

app.get('/courses/:id', (req, res) => {
    const foundCourse = db.courses
        .find(cours => cours.id === +req.params.id);

    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);
        return;
    }

    res.json(foundCourse);
})

app.post('/courses', (req, res) => {

    if (!req.body.title){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST400);
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

app.delete('/courses/:id', (req, res) => {
    const courseId = +req.params.id;
    const courseIndex = db.courses.findIndex(course => course.id === courseId);

    if (courseIndex === -1) {
        // Если объект не существует, отправляем статус 404 Not Found
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);
    } else {
        // Если объект существует, выполняем его удаление
        db.courses = db.courses.filter(course => course.id !== courseId);
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
});

app.put('/courses/:id', (req, res) => {

    if(!req.body.title){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST400);
        return;
    }

    const foundCourse = db.courses
        .find(cours => cours.id === +req.params.id);

    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);
        return;
    }

    foundCourse.title = req.body.title;

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.delete('/__test__/data', (req, res) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.listen(port, () => {
    console.log('Port active: ' + port);
});