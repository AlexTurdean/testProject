import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import mongoose from 'mongoose';

export function create (req: Request, res: Response, next: NextFunction)
{
    const shift = {
        "_id": new mongoose.Types.ObjectId(),
        date: req.body.date,
        hour: req.body.hour
    }
    User.updateOne(
        { _id: res.locals.session.id },
        { $push: { shifts: shift } }
    ).then(result => {
        res.status(200).send(shift);
    }).catch(err => {
        next(err);
    });
}

export function get (req: Request, res: Response, next: NextFunction)
{
    User.findOne({ _id: res.locals.session.id }, "shifts").then(result => {
        res.status(200).send(result);
    }).catch(err => {
        next(err);
    });
}

export function update (req: Request, res: Response, next: NextFunction)
{
    User.findOneAndUpdate({
        _id: res.locals.session.id,
        "shifts._id": req.params.shiftId
    },
    {
        "$set": {
            "shifts.$.hour": req.body.hour
        }
    }).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        next(err);
    });
}

export function remove (req: Request, res: Response, next: NextFunction)
{
    User.findOneAndUpdate({
        _id: res.locals.session.id
    },
    {
        "$pull": {
            "shifts": {'_id': req.params.shiftId}
        }
    }).then(result => {
        res.status(200).end();
    }).catch(err => {
        next(err);
    });
}
