import express, { Express, Request, Response, NextFunction } from 'express';
import HttpException from './interfaces/HttpException';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/database';
import routes from './routes';

dotenv.config();
connectDB();

const PORT = process.env.PORT || 3000;
export const app: Express = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);


app.use(function errorHandler (err: HttpException, req: Request, res: Response, next: NextFunction) {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    console.log(message);
    res.status(status).send({status, message});
});

app.listen(PORT, () => console.log(`Running on ${PORT}`));

if(process.env.NODE_ENV == "test")
{
    console.log = function(){};
}
