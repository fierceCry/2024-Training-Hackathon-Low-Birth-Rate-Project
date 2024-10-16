import express from "express";
import { ReplyController } from "../controllers/reply.controller.js";
import { ReplyService } from "../services/reply.service.js";
import { ReplyRepository } from "../repositories/reply.repository.js";  
import { authMiddleware } from "../middlewarmies/require-access-token.middleware.js";
import { prisma } from "../database/db.prisma.js";
const replyRouter = express.Router();

const replyRepository = new ReplyRepository(prisma); 
const replyService = new ReplyService(replyRepository);
const replyController = new ReplyController(replyService);

replyRouter.post("", authMiddleware, replyController.createReply);
replyRouter.patch("/:replyId", authMiddleware, replyController.updateReply);
replyRouter.delete("/:replyId", authMiddleware, replyController.deleteReply);

export { replyRouter };