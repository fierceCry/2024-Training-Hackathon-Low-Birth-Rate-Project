import express from "express";
import { prisma } from "../database/db.prisma.js";
import { BirthSupportDataController } from "../controllers/birth-support-data.controller.js";
import { BirthSupportDataService } from "../services/birth-support-data.service.js";
import { BirthSupportDataRepository } from "../repositories/birth-support-data.repository.js";

const birthSupportDataRepository = new BirthSupportDataRepository(prisma);
const birthSupportDataService = new BirthSupportDataService(birthSupportDataRepository);
const birthSupportDataController = new BirthSupportDataController(birthSupportDataService);

const birthSupportDataRouter = express.Router();

birthSupportDataRouter.get("/all", birthSupportDataController.getAllBirthSupportData);
birthSupportDataRouter.get("/:birthSupportDataId", birthSupportDataController.getBirthSupportDataById);

export { birthSupportDataRouter };
