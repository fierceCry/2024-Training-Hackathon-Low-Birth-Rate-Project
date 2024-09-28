import express from "express";
import { CommunityController } from "../controllers/communtiy.controller.js";
import { CommunityServices } from "../services/community.services.js";
import { CommunityRepository } from "../repositories/community.repositiories.js";
import { authMiddleware } from "../middlewarmies/require-access-token.middleware.js";
import community from "../database/models/community.model.js";

const communityRouter = express.Router();

const communityRepository = new CommunityRepository(community);
const communityServices = new CommunityServices(communityRepository);
const communityController = new CommunityController(communityServices);

communityRouter.post('',authMiddleware, communityController.createCommunity);
communityRouter.get('',communityController.getAllcreateCommunity);
communityRouter.get('/:id',communityController.getCommunityById);
communityRouter.patch('/:id', authMiddleware, communityController.updateCommunity);
communityRouter.delete('/:id', authMiddleware, communityController.deleteCommunity);

export { communityRouter };
