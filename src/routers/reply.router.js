import express from "express";
import { ReplyController } from "../controllers/reply.controller.js";
import { ReplyService } from "../services/reply.service.js";
import { ReplyRepository } from "../repositories/reply.repository.js";  
import Reply from "../database/models/reply.model.js";
import { authMiddleware } from "../middlewarmies/require-access-token.middleware.js";

const replyRouter = express.Router();

const replyRepository = new ReplyRepository(Reply); 
const replyService = new ReplyService(replyRepository);
const replyController = new ReplyController(replyService);

replyRouter.post("", authMiddleware, replyController.createReply);
// replyRouter.get("/", replyController.getReplies);
// replyRouter.put("/:id", replyController.updateReply);
// replyRouter.delete("/:id", replyController.deleteReply);

export { replyRouter };