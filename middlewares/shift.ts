import { Request, Response, NextFunction } from 'express';
import HttpException from '../interfaces/HttpException';
import User from '../models/user';

export function create (req: Request, res: Response, next: NextFunction)
{
    if(req.body.hour == undefined || req.body.date == undefined)
        return next( new HttpException(400, 'Empty field') );
    if(req.body.hour != 0 && req.body.hour != 8 && req.body.hour != 16)
        return next( new HttpException(400, 'Hour must be in [0, 8, 16]') );
    User.findOne({
        _id: res.locals.session.id,
        "shifts.date": req.body.date
    },'name').then(shift => {
        if(shift)
            next( new HttpException(400, 'A shift with the same date exists'));
        else
            next();
    }).catch(err => {
        next(err);
    });
}

export function update (req: Request, res: Response, next: NextFunction)
{
    if(req.body.hour == undefined || req.params.shiftId == undefined)
        return next( new HttpException(400, 'Empty field') );
    if(req.body.hour != 0 && req.body.hour != 8 && req.body.hour != 16)
        return next( new HttpException(400, 'Hour must be in [0, 8, 16]') );
    User.findOne({
        _id: res.locals.session.id,
        "shifts._id": req.params.shiftId
    },'name').then(shift => {
        if(shift)
            next();
        else
            next( new HttpException(400, 'Shift does not exist or it is not yours'));
    }).catch(err => {
        next(err);
    });
}
