import express from "express";
import { CommentController } from "../controllers/comment.controller.js";
import { CommentRepository } from "../repositories/comment.repositories.js";
import { CommentService } from "../services/comment.service.js";
import { authMiddleware } from "../middlewarmies/require-access-token.middleware.js";
import { prisma } from "../database/db.prisma.js";

const commentRouter = express.Router();

const commentRepository = new CommentRepository(prisma);
const commentService = new CommentService(commentRepository);
const commentController = new CommentController(commentService);

commentRouter.post("", authMiddleware, commentController.createComment);
commentRouter.get("/:communtiyId", commentController.getAllComments);
commentRouter.patch("/:communtiyId", authMiddleware, commentController.updateComment);
commentRouter.delete("/:communtiyId", authMiddleware, commentController.deleteComment);

export { commentRouter };
