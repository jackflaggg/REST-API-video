import express from "express";
import {addCoursesRoutes} from "./routes/courses";
import {addTestsRoutes} from "./routes/tests";
import {db} from "./db/db";


export const app = express();

export const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);

addCoursesRoutes(app, db);
addTestsRoutes(app, db)

