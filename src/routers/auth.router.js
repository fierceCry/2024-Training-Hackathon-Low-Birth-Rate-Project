import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { AuthServices } from "../services/auth.services.js";
import { AuthRepository } from "../repositories/auth.repositories.js";
import User from "../database/models/user.model.js";
import RefreshToken from "../database/models/refreshToken.model.js";

const authRouter = express.Router();

const authRepository = new AuthRepository(User, RefreshToken);
const authServices = new AuthServices(authRepository);
const authController = new AuthController(authServices);

authRouter.post("/sign-up", authController.signUp);
authRouter.post("/sign-in", authController.signIn);

export { authRouter };
