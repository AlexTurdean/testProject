import express from 'express';
import * as Controllers from '../controllers';
import * as Middlewares from '../middlewares';

const router = express.Router();

router.post('/shift', Middlewares.user.logged, Middlewares.shift.create, Controllers.shift.create);
router.get('/shift', Middlewares.user.logged, Controllers.shift.get);
router.put('/shift/:shiftId', Middlewares.user.logged, Middlewares.shift.update, Controllers.shift.update);
router.delete('/shift/:shiftId', Middlewares.user.logged, Controllers.shift.remove);

export default router;
