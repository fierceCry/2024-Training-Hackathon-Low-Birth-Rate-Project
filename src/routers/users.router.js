import express from "express";
import { prisma } from "../database/db.prisma.js";
import { authMiddleware } from "../middlewarmies/require-access-token.middleware.js";
import { UsersController } from "../controllers/users.controller.js";
import { UsersService } from "../services/users.service.js";
import { UsersRepository } from "../repositories/users.repository.js";
const usersRouter = express.Router();

const usersRepository = new UsersRepository(prisma);
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

usersRouter.get('', authMiddleware, usersController.findUsers)
export { usersRouter };
