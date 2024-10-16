import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HttpError } from "../errors/http.error.js";
import { HASH_SALT_ROUNDS } from "../constants/auth.constants.js";
import { ENV_KEY } from "../constants/env.constants.js";

export class AuthServices {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async signUp({ email, password, name }) {
    if(!email || !password || !name){
      throw new HttpError.BadRequest('email, password, name 값 확인해 주세요.');
    }

    const user = await this.authRepository.findUserByEmail({ email });
    if (user) {
      throw new HttpError.Conflict("이미 가입된 이메일이 있습니다.");
    }

    const existingNickname = await this.authRepository.findByUserName({
      name,
    });
    if (existingNickname) {
      throw new HttpError.Conflict("이미 사용 중인 닉네임입니다.");
    }

    const hashedPassword = bcrypt.hashSync(password, HASH_SALT_ROUNDS);

    return this.authRepository.createUser({
      email,
      hashedPassword,
      name,
    });
  }

  async signIn({ email, password }) {
    const user = await this.authRepository.findUserByEmail({
      email
    });
    if (!user) {
      throw new HttpError.BadRequest("가입 된 사용자가 없습니다.");
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      throw new HttpError.Unauthorized("비밀번호가 일치하지 않습니다.");
    }

    const { accessToken, refreshToken, hashRefreshToken } = this.generateTokens(user._id);

    await this.authRepository.createToken({ userId: user.id, hashRefreshToken });
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
