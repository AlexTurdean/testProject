import { Request, Response, NextFunction } from 'express';
import HttpException from '../interfaces/HttpException';
import * as config from '../config/config.json';
import { decodeSession, checkExpiration, encodeSession, DecodeResult, ExpirationStatus, Session } from '../auth/jwt';
import User from '../models/user';

export function create (req: Request, res: Response, next: NextFunction)
{
    if(req.body.name == undefined || req.body.password == undefined)
        return next( new HttpException(400, 'Empty field') );

    User.findOne({
        name: req.body.name,
    }).then(user => {
        if(user)
            next( new HttpException(400, 'User already exists'));
        else
            next();
    }).catch(err => {
        next(err);
    });
}

export function login (req: Request, res: Response, next: NextFunction)
{
    if(req.body.name == undefined || req.body.password == undefined)
        return next( new HttpException(400, 'Empty field') );

    User.findOne({
        name: req.body.name,
    }).then(user => {
        if(user && user.isPasswordValid(req.body.password))
        {
            res.locals.user = user;
            next();
        }
        else
            next( new HttpException(400, 'Invalid name or password'));
    }).catch(err => {
        next(err);
    });
}

export function logged (req: Request, res: Response, next: NextFunction) {
    const requestHeader = "X-JWT-Token";
    const responseHeader = "X-Renewed-JWT-Token";
    const header = req.header(requestHeader);

    if (!header)
        return next( new HttpException(401, `Required ${requestHeader} header not found.`) );

    const decodedSession: DecodeResult = decodeSession(config.jwtSecret, header);

    if (decodedSession.type === "integrity-error" || decodedSession.type === "invalid-token")
        return next( new HttpException(401, `Failed to decode or validate authorization token. Reason: ${decodedSession.type}.`) );

    const expiration: ExpirationStatus = checkExpiration(decodedSession.session);

    if (expiration === "expired")
        return next( new HttpException(401, `Authorization token has expired. Please create a new authorization token.`) );

    let session: Session;

    if (expiration === "grace") {
        const { token, expires, issued } = encodeSession(config.jwtSecret, decodedSession.session);
        session = {
            ...decodedSession.session,
            expires: expires,
            issued: issued
        };
        res.setHeader(responseHeader, token);
    } else {
        session = decodedSession.session;
    }

    res.locals.session = session;
    next();
}
