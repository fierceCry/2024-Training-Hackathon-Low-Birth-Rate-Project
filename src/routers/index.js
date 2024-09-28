import express from 'express';
import { authRouter } from '../routers/auth.router.js';
import { communityRouter } from '../routers/community.router.js'

const router = express.Router();

router.use('/auth', authRouter);
router.use('/communtiy', communityRouter)

export { router };
