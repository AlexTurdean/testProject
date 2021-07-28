import { Request, Response, NextFunction } from 'express';
import * as config from '../config/config.json';
import { encodeSession } from '../auth/jwt';
import User from '../models/user';

export function create (req: Request, res: Response, next: NextFunction)
{
    User.create({
        name: req.body.name,
        password: req.body.name
    }).then(user => {
        user.password = undefined;
        res.status(200).send(user);
    }).catch(err => {
        next(err);
    });
}

export function login (req: Request, res: Response, next: NextFunction) {
    let user = res.locals.user;
    const session = encodeSession(config.jwtSecret, {
        id: user.id,
        name: user.name
    });
    res.status(200).send(session);
}
