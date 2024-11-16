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
 *     tags: [인증]
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
 *     tags: [인증]
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

/**
 * @swagger
 * /auth/auth-code:
 *   post:
 *     summary: 인증 코드 전송
 *     tags: [인증]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             example:
 *               email: "example@example.com"
 */

/**
 * @swagger
 * /auth/verify-email:
 *   get:
 *     summary: 인증 코드 검증
 *     tags: [인증]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         description: 이메일 주소
 *         schema:
 *           type: string
 *       - in: query
 *         name: verifyCode
 *         required: true
 *         description: 인증 코드
 *         schema:
 *           type: string
 */

/**
 * @swagger
 * /auth/verify-nickname:
 *   get:
 *     summary: 닉네임 중복 확인
 *     description: 사용자가 입력한 닉네임이 중복되는지 확인합니다.
 *     tags: [인증]
 *     parameters:
 *       - in: query
 *         name: nickname
 *         schema:
 *           type: string
 *         required: true
 *         description: 확인할 닉네임
 *     responses:
 *       200:
 *         description: 닉네임이 사용 가능한 경우
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAvailable:
 *                   type: boolean
 *                   description: 닉네임 사용 가능 여부
 *       400:
 *         description: 유효하지 않은 요청 (닉네임 미입력 등)
 *       500:
 *         description: 서버 오류
 */

authRouter.post("/sign-up", authController.signUp);
authRouter.post("/sign-in", authController.signIn);
authRouter.post("/auth-code", authController.sendVerificationEmail);
authRouter.get("/verify-email", authController.verifyEmail);
authRouter.get("/verify-nickname", authController.verifyNickname);
export { authRouter };
