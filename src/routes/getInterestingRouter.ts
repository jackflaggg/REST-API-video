import {DBType} from "../db/db";
import express from "express";
import {RequestWithParams, RequestWithQuery} from "../types";
import {QueryCoursesModel} from "../features/courses/models/QueryCoursesModel";
import {URIParamsCourseIdModel} from "../features/courses/models/URIParamsCourseIdModel";

export const getInterestingRouter = (db: DBType) => {
    const router = express.Router();

    router.get('/:id([0-9]+)', (req: RequestWithParams<URIParamsCourseIdModel>,
                             res) => {

        res.json({title: 'data by id: ' + req.params.id});
    })

    router.get('/books', (req: RequestWithQuery<QueryCoursesModel>,
                          res) => {

        res.json({title: ' its books'})
    });


    return router;
}