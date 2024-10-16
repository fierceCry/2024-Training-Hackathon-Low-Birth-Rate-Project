import jwt from "jsonwebtoken";
import { ENV_KEY } from "../constants/env.constants.js";
import { HttpError } from "../errors/http.error.js";
import { AuthRepository } from "../repositories/auth.repositories.js";
import { prisma } from "../database/db.prisma.js";

const authRepository = new AuthRepository(prisma);

const validateToken = async (token, secretKey) => {
  try {
    const payload = jwt.verify(token, secretKey);
    return payload;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return "expired";
    } else {
      return "JsonWebTokenError";
    }
  }
};

/** accessToken 토큰 검증 API **/
const authMiddleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw new HttpError.BadRequest("인증 정보가 없습니다.");
    }

    const token = authorizationHeader.split("Bearer ")[1];
    if (!token) {
      throw new HttpError.Unauthorized("지원하지 않는 인증 방식입니다.");
    }

    const payload = await validateToken(token, ENV_KEY.SECRET_KEY);
    if (payload === "expired") {
      throw new HttpError.Unauthorized("인증 정보가 만료되었습니다.");
    } else if (payload === "JsonWebTokenError") {
      throw new HttpError.Unauthorized("인증 정보가 유효하지 않습니다.");
    }
    const { id } = payload;
    const user = await authRepository.findUserById(id);
    if (!user) {
      throw new HttpError.NotFound("인증 정보와 일치하는 사용자가 없습니다.");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export { authMiddleware, validateToken };
