import express, { Express, Request, Response, NextFunction } from 'express';
import HttpException from './interfaces/HttpException';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/database';

dotenv.config();
connectDB();

const PORT = process.env.PORT || 3000;
const app: Express = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(function errorHandler (err: HttpException, req: Request, res: Response, next: NextFunction) {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    res.status(status).send({status, message});
});

app.listen(PORT, () => console.log(`Running on ${PORT}`));
