import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import { cacheManager } from "../utils/cacheManager.js";
import { HttpError } from "../errors/http.error.js";
import { HASH_SALT_ROUNDS } from "../constants/auth.constants.js";
import { ENV_KEY } from "../constants/env.constants.js";
import getLogger from "../common/logger.js";

const userAuthStates = {};

const logger = getLogger('auth')
export class AuthServices {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async signUp({ email, password, name }) {
    if (!email || !password || !name) {
      throw new HttpError.BadRequest("email, password, name 값 확인해 주세요.");
    }

    const userState = userAuthStates[email];

    // if (!userState || !userState.isVerified) {
    //   throw new HttpError.BadRequest("이메일 인증이 필요합니다.");
    // }

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

    const newUser = await this.authRepository.createUser({
      email,
      hashedPassword,
      name,
    });
    delete userAuthStates[email];
    return newUser;
  }

  async signIn({ email, password }) {
    const user = await this.authRepository.findUserByEmail({
      email,
    });
    if (!user) {
      throw new HttpError.BadRequest("가입 된 사용자가 없습니다.");
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      throw new HttpError.Unauthorized("비밀번호가 일치하지 않습니다.");
    }

    const { accessToken, refreshToken, hashRefreshToken } = this.generateTokens(user.id);

    await this.authRepository.createToken({ userId: user.id, hashRefreshToken });
    return { accessToken, refreshToken };
  }

  async sendVerificationEmail({ email }) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new HttpError.BadRequest("유효하지 않은 이메일 형식입니다.");
    }
    userAuthStates[email] = { isVerified: false };

    const verificationCode = this.generateVerificationCode();
    logger.info(verificationCode);
    const smtpTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: ENV_KEY.MAIL_AUTH_USER,
        pass: ENV_KEY.MAIL_AUTH_PASS,
      },
    });

    const mailOptions = {
      from: ENV_KEY.MAIL_AUTH_USER,
      to: email,
      subject: "2024 해커톤 트레니닝 저출산 한마음 프로젝트 인증코드",
      html: `
        <p>${verificationCode}</p>
        `,
    };
    cacheManager.set(email, verificationCode);
    smtpTransport.sendMail(mailOptions);
  }

  async verifyEmail({ email, verifyCode }) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new HttpError.BadRequest("유효하지 않은 이메일 형식입니다.");
    }
    const code = cacheManager.get(email);

    if (code !== verifyCode) {
      throw new HttpError.NotFound("인증코드가 일치하지 않습니다.");
    }
    userAuthStates[email].isVerified = true;
    cacheManager.delete(email);
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

  generateVerificationCode() {
    return otpGenerator.generate(6, {
      upperCaseAlphabets: true,
      lowerCaseAlphabets: true,
      specialChars: false,
      digits: true,
    });
  }
}
