import { HTTP_STATUS } from "../constants/http-status.constant.js";

export class AuthController {
  constructor(authServices) {
    this.authServices = authServices;
  }

  signUp = async (req, res, next) => {
    try {
      const { id, password, username } = req.body;

      await this.authServices.signUp({ id, password, username });
      return res
        .status(HTTP_STATUS.CREATED)
        .json({ message: "회원가입이 완료되었습니다." });
    } catch (error) {
      next(error);
    }
  }
}
