import express from "express";
import {getCoursesRouter} from "./routes/courses";
import {getTestsRouter} from "./routes/tests";
import {db} from "./db/db";
import {getInterestingRouter} from "./routes/getInterestingRouter";


export const app = express();

export const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);

app.use("/courses", getCoursesRouter(db))
app.use("/__test__", getTestsRouter(db))
app.use("/interestiny", getInterestingRouter(db))

