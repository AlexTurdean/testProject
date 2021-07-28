import express from 'express';
import * as Controllers from '../controllers';
import * as Middlewares from '../middlewares';

const router = express.Router();

router.post('/signup', Middlewares.user.create, Controllers.user.create);
router.post('/login', Middlewares.user.login, Controllers.user.login);

export default router;
