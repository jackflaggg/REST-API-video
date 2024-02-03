import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../../types";
import express, { Response} from "express";
import { DBType, UserType} from "../../db/db";
import {HTTP_STATUSES} from "../../utils";
import {UpdateUserModel} from "./models/UpdateUserModel";
import {UserAPIModel} from "./models/UserAPIModel";
import {URIParamsUserIdModel} from "./models/URIParamsUserIdModel";
import {QueryUsersModel} from "./models/QueryUsersModel";
import {CreateUserModel} from "./models/CreateUserModel";


export function getUserViewModel(dbUser: UserType): UserAPIModel {
    return {
        id: dbUser.id,
        userName: dbUser.userName,
    }
}

export const getUsersRouter = (db: DBType) => {
    const router = express.Router();

    router.get('/', (req: RequestWithQuery<QueryUsersModel>,
                     res: Response<UserAPIModel[]>) => {
        let foundUsers = db.users;


        if (req.query.userName){
            foundUsers = foundUsers
                .filter(user => user.userName.indexOf(req.query.userName) > -1);
        }

        res.json(foundUsers.map(getUserViewModel))
    });

    router.get('/:id', (req: RequestWithParams<URIParamsUserIdModel>,
                        res: Response<UserAPIModel>) => {
        const foundUser = db.users
            .find(users => users.id === +req.params.id);

        if (!foundUser) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.json(getUserViewModel(foundUser));
    })

    router.post('/', (req: RequestWithBody<CreateUserModel>,
                      res: Response<UserAPIModel>) => {

        if (!req.body.userName){
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }

        const cratedUser: UserType = {
            id: +(new Date()),
            userName: req.body.userName,
        };
        db.users.push(cratedUser);
        //положили в бд

        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(getUserViewModel(cratedUser));
    });

    router.delete('/:id', (req: RequestWithParams<URIParamsUserIdModel>,
                           res) => {
        const userId = +req.params.id;
        const userIndex = db.users.findIndex(user => user.id === userId);

        if (userIndex === -1) {
            // Если объект не существует, отправляем статус 404 Not Found
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        } else {
            // Если объект существует, выполняем его удаление
            db.users = db.users.filter(user => user.id !== userId);
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        }
    });

    router.put('/:id', (req: RequestWithParamsAndBody<URIParamsUserIdModel, UpdateUserModel>,
                        res) => {

        if(!req.body.userName){
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }

        const foundUser = db.users
            .find(users => users.id === +req.params.id);

        if (!foundUser) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        foundUser.userName = req.body.userName;

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });

    return router;
}
