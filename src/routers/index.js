import express from "express";
import { authRouter } from "../routers/auth.router.js";
import { communityRouter } from "../routers/community.router.js"
import { commentRouter } from "./comment.router.js";
import { replyRouter } from "./reply.router.js";
import { chatRouter } from "./chat.router.js";
const router = express.Router();

router.use("/auth", authRouter);
router.use("/communtiy", communityRouter)
router.use("/comment", commentRouter)
router.use("/reply", replyRouter)
router.use("/chat", chatRouter)
export { router };
