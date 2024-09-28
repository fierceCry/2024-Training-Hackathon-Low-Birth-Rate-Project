import bcrypt from "bcrypt";
import { HttpError } from "../errors/http.error.js";
import { HASH_SALT_ROUNDS } from "../constants/auth.constants.js";

export class AuthServices {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async signUp({ id, password, username }) {
    const user = await this.authRepository.findUserById({ id });
    console.log(user);
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
}
