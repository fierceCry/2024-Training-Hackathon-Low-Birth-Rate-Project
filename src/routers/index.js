import express from 'express';
import { authRouter } from '../routers/auth.router.js';
// import { usersRouter } from './users.router.js';

const router = express.Router();

router.use('/auth', authRouter);
// router.use('/users', usersRouter);

export { router };
