import express from "express";
import {getCoursesRouter} from "./routes/courses";
import {getTestsRouter} from "./routes/tests";
import {db} from "./db/db";


export const app = express();

export const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);

const coursesRouter = getCoursesRouter(db);
const testsRouter = getTestsRouter(db);
app.use("/courses", coursesRouter)
app.use("/__test__", testsRouter)

