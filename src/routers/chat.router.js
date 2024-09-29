import express from "express";
import { ChatController } from "../controllers/chat.controller.js";
import { ChatService } from "../services/chat.service.js";
import { ChatRepository } from "../repositories/chat.repository.js";
import Chat from "../database/models/chat.model.js";

const chatRepository = new ChatRepository(Chat);  
const chatService = new ChatService(chatRepository);
const chatController = new ChatController(chatService);

const chatRouter = express.Router();

chatRouter.post("", chatController.handleChat);

export { chatRouter };