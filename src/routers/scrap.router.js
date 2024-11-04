import express from "express";
import { prisma } from "../database/db.prisma.js";
import { ScrapController } from "../controllers/scrap.controller.js";
import { ScrapRepository } from "../repositories/scrap.repositories.js";
import { ScrapService } from "../services/scrap.service.js";

const scrapRouter = express.Router();

const scrapRepository = new ScrapRepository(prisma);
const scrapService = new ScrapService(scrapRepository);
const scrapController = new ScrapController(scrapService);

scrapRouter.get("", scrapController.getScrap);
scrapRouter.post("", scrapController.createScrap);

export { scrapRouter };
