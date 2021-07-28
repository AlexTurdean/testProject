import express from 'express';
import userRoutes from './user';
import shiftRoutes from './shift';

const router = express.Router();
router.use(userRoutes);
router.use(shiftRoutes);

export default router;
