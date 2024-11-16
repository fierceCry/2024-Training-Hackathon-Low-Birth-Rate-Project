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

/**
 * @swagger
 * /users:
 *   get:
 *     summary: 사용자의 정보 조회
 *     tags: [유저]
 *     description: JWT 토큰을 사용하여 사용자의 정보를 조회합니다.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 정보가 성공적으로 반환되었습니다.
 *       401:
 *         description: 인증 실패 (토큰 없음 또는 유효하지 않음)
 *       500:
 *         description: 서버 오류
 */
usersRouter.get('', authMiddleware, usersController.findUsers)
export { usersRouter };
