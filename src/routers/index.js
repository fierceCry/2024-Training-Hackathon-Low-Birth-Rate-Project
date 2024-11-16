import express from "express";
import { authRouter } from "../routers/auth.router.js";
import { chatRouter } from "./chat.router.js";
import { scrapRouter } from "./scrap.router.js";
import { birthSupportDataRouter } from "./birth-support-data.router.js";
import { usersRouter } from "./users.router.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/birth-support-data", birthSupportDataRouter);
router.use("/chat", chatRouter);
router.use("/scrap", scrapRouter);
router.use('/users', usersRouter)
export { router };
