import express from "express";
import { authRouter } from "../routers/auth.router.js";
import { commentRouter } from "./comment.router.js";
import { replyRouter } from "./reply.router.js";
import { chatRouter } from "./chat.router.js";
import { scrapRouter } from "./scrap.router.js";
import { birthSupportDataRouter } from "./birth-support-data.router.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/comment", commentRouter);
router.use("/reply", replyRouter);
router.use("/chat", chatRouter);
router.use("/scrap", scrapRouter);
router.use("/birthSupportData", birthSupportDataRouter);
export { router };
