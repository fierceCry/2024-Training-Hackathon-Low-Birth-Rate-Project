import express from "express";
import { ChatController } from "../controllers/chat.controller.js";
import { ChatService } from "../services/chat.service.js";
import { ChatRepository } from "../repositories/chat.repository.js";
import { prisma} from '../database/db.prisma.js';
import { authMiddleware } from "../middlewarmies/require-access-token.middleware.js";
import { AuthRepository } from "../repositories/auth.repositories.js";

const authRepository = new AuthRepository(prisma);
const chatRepository = new ChatRepository(prisma);  
const chatService = new ChatService(chatRepository, authRepository);
const chatController = new ChatController(chatService);

const chatRouter = express.Router();

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: 심리상담
 *     tags: [심리상담]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               isRespectful:
 *                 type: boolean
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:    
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 */
chatRouter.post("", authMiddleware, chatController.handleChat);
// chatRouter.post("", chatController.handleChat);
chatRouter.get("/chat-user-list", authMiddleware, chatController.chatList);

export { chatRouter }; 
