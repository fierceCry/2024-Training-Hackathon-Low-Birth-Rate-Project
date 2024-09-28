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

  signIn = async (req, res, next) => {
    try {
      const { id, password } = req.body;
      const token = await this.authServices.signIn({
        id,
        password
      });
      return res
        .status(HTTP_STATUS.OK)
        .json({ message: '로그인이 성공하였습니다.', data: token });
    } catch (error) {
      next(error);
    }
  };
}
