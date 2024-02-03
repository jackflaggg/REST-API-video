import {DBType} from "../db/db";
import express from "express";
import {HTTP_STATUSES} from "../utils";


export const getTestsRouter = (db: DBType) => {
    const router = express.Router()
    router.delete('/data', (req,
                                  res) => {
        db.courses = [];
        db.users = [];
        db.studentCourseBindings = [];
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    })

    return router;
}