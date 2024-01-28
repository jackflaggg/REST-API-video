import {DBType} from "../db/db";
import {HTTP_STATUSES} from "./courses";
import {Express} from "express";


export const addTestsRoutes = (app: Express, db: DBType) => {
    app.delete('/__test__/data', (req,
                                  res) => {
        db.courses = [];
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    })
}