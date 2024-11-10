import express from "express";
import { prisma } from "../database/db.prisma.js";
import { BirthSupportDataController } from "../controllers/birth-support-data.controller.js";
import { BirthSupportDataService } from "../services/birth-support-data.service.js";
import { BirthSupportDataRepository } from "../repositories/birth-support-data.repository.js";

const birthSupportDataRouter = express.Router();
const birthSupportDataRepository = new BirthSupportDataRepository(prisma);
const birthSupportDataService = new BirthSupportDataService(birthSupportDataRepository);
const birthSupportDataController = new BirthSupportDataController(birthSupportDataService);

/**
 * @swagger
 * /birth-support-data/all:
 *   get:
 *     summary: 모든 출산 지원 데이터를 조회
 *     tags: [지원금 리스트]
 *     parameters:
 *       - in: query
 *         name: addressProvince
 *         required: false
 *         description: "출산 지원 데이터의 도(省)"
 *         schema:
 *           type: string
 *       - in: query
 *         name: addressCity
 *         required: false
 *         description: "출산 지원 데이터의 시(市)"
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         description: "페이지 번호 (기본값: 1)"
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         required: false
 *         description: "한 페이지에 표시할 데이터 수 (기본값: 10)"
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         required: false
 *         description: "데이터 정렬 방식 (기본값: desc)"
 *         schema:
 *           type: string
 *           enum: ["desc", "asc", "viewCount", "scrapCount"]
 *     responses:
 *       200:
 *         description: 출산 지원 데이터 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       addressProvince:
 *                         type: string
 *                       addressCity:
 *                         type: string
 *                       supportAmount:
 *                         type: number
 *                         format: float
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /birth-support-data/{birthSupportDataId}:
 *   get:
 *     summary: 특정 출산 지원 데이터 조회
 *     tags: [지원금 리스트]
 *     parameters:
 *       - in: path
 *         name: birthSupportDataId
 *         required: true
 *         description: "조회할 출산 지원 데이터의 ID"
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 특정 출산 지원 데이터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     addressProvince:
 *                       type: string
 *                     addressCity:
 *                       type: string
 *                     supportAmount:
 *                       type: number
 *                       format: float
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: 해당 ID의 출산 지원 데이터를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

birthSupportDataRouter.get("/all", birthSupportDataController.getAllBirthSupportData);
birthSupportDataRouter.get(
  "/:birthSupportDataId",
  birthSupportDataController.getBirthSupportDataById,
);

export { birthSupportDataRouter };
