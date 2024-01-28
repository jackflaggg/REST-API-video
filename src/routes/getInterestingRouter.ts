import {DBType} from "../db/db";
import express from "express";
import {RequestWithParams, RequestWithQuery} from "../types";
import {QueryCoursesModel} from "../models/QueryCoursesModel";
import {URIParamsCourseIdModel} from "../models/URIParamsCourseIdModel";

export const getInterestingRouter = (db: DBType) => {
    const router = express.Router();

    router.get('/books', (req: RequestWithQuery<QueryCoursesModel>,
                          res) => {

        res.json({title: ' its books'})
    });

    router.get('/:id', (req: RequestWithParams<URIParamsCourseIdModel>,
                        res) => {

        res.json({title: 'data by id: ' + req.params.id});
    })



    return router;
}