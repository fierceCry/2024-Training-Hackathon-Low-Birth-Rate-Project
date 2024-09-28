import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HttpError } from "../errors/http.error.js";
import { HASH_SALT_ROUNDS } from "../constants/auth.constants.js";
import { ENV_KEY } from "../constants/env.constants.js";

export class AuthServices {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async signUp({ id, password, username }) {
    const user = await this.authRepository.findUserById({ id });
    if (user) {
      throw new HttpError.Conflict("이미 가입된 사용자가 있습니다.");
    }

    const existingNickname = await this.authRepository.findByUserName({
      username,
    });
    if (existingNickname) {
      throw new HttpError.Conflict("이미 사용 중인 닉네임입니다.");
    }

    const hashedPassword = bcrypt.hashSync(password, HASH_SALT_ROUNDS);
    await this.authRepository.createUser({
      id,
      hashedPassword,
      username,
    });
  }

  async signIn({ id, password }) {
    const user = await this.authRepository.findUserById({
      id,
    });
    if (!user) {
      throw new HttpError.BadRequest("가입 된 사용자가 없습니다.");
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      throw new HttpError.Unauthorized("인증정보가 유효하지 않습니다.");
    }

    const { accessToken, refreshToken, hashRefreshToken } = this.generateTokens(
      user._id
    );
    await this.authRepository.token(user._id, hashRefreshToken);

    return { accessToken, refreshToken };
  }

  generateTokens(userId) {
    const accessToken = jwt.sign({ id: userId }, ENV_KEY.SECRET_KEY, {
      expiresIn: ENV_KEY.ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = jwt.sign({ id: userId }, ENV_KEY.REFRESH_SECRET_KEY, {
      expiresIn: ENV_KEY.REFRESH_TOKEN_EXPIRES_IN,
    });
    const hashRefreshToken = bcrypt.hashSync(refreshToken, HASH_SALT_ROUNDS);
    return { accessToken, refreshToken, hashRefreshToken };
  }
}
