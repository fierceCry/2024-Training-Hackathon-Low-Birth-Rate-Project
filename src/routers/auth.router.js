import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { AuthServices } from "../services/auth.service.js";
import { AuthRepository } from "../repositories/auth.repositories.js";
import { prisma } from "../database/db.prisma.js";

const authRouter = express.Router();

const authRepository = new AuthRepository(prisma);
const authServices = new AuthServices(authRepository);
const authController = new AuthController(authServices);

/**
 * @swagger
 * /auth/sign-up:
 *   post:
 *     summary: 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               logId:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *             example:          # 샘플 데이터 추가
 *               logId: "user123"
 *               password: "password123"
 *               username: "username"
 */

/**
 * @swagger
 * /auth/sign-in:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               logId:
 *                 type: string
 *               password:
 *                 type: string
 *             example:          # 샘플 데이터 추가
 *               logId: "user123"
 *               password: "password123"
 */

authRouter.post("/sign-up", authController.signUp);
authRouter.post("/sign-in", authController.signIn);

export { authRouter };
