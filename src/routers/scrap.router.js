import express from "express";
import { prisma } from "../database/db.prisma.js";
import { ScrapController } from "../controllers/scrap.controller.js";
import { ScrapRepository } from "../repositories/scrap.repositories.js";
import { ScrapService } from "../services/scrap.service.js";
import { authMiddleware } from "../middlewarmies/require-access-token.middleware.js";
const scrapRouter = express.Router();

const scrapRepository = new ScrapRepository(prisma);
const scrapService = new ScrapService(scrapRepository);
const scrapController = new ScrapController(scrapService);

/**
 * @swagger
 * /scrap:
 *   post:
 *     summary: 스크랩 생성
 *     description: This endpoint allows a user to create a scrap for a specific birth support data item.
 *     tags:
 *       - 스크랩
 *     parameters:
 *       - in: body
 *         name: scrap
 *         description: The ID of the birth support data to be scrapped.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             birthSupportDataId:
 *               type: number
 *               description: The ID of the birth support data.
 *     responses:
 *       201:
 *         description: Successfully created the scrap.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: The scrap object created.
 */

/**
 * @swagger
 * /scrap:
 *   get:
 *     summary: 스크랩 조회
 *     description: This endpoint retrieves all scrap data for the currently logged-in user.
 *     tags:
 *       - 스크랩
 *     responses:
 *       200:
 *         description: Successfully retrieved scrap data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: The scrap data associated with the user.
 */

scrapRouter.get("", authMiddleware, scrapController.getScrap);
scrapRouter.post("", authMiddleware, scrapController.createScrap);

export { scrapRouter };
