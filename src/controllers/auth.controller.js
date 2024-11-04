import { HTTP_STATUS } from "../constants/http-status.constant.js";

export class AuthController {
    constructor(authServices) {
    this.authServices = authServices;
    }

    sendVerificationEmail = async (req, res, next) => {
      try{
        const { email } = req.body;
        await this.authServices.sendVerificationEmail({email})
        return res.status(HTTP_STATUS.CREATED).json({message: '인증코드 발송되었습니다.'})
      }catch(error){
        next(error)
      }
    }
  
    verifyEmail = async (req, res, next) => {
      try{
        const { email, verifyCode } = req.query;
        await this.authServices.verifyEmail({email, verifyCode})
        return res.status(HTTP_STATUS.OK).json({message: '인증코드가 일치합니다.'})
      }catch(error){
        next(error)
      }
    }
    
    signUp = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

      await this.authServices.signUp({ email, password, name });
      return res
        .status(HTTP_STATUS.CREATED)
        .json({ message: "회원가입이 완료되었습니다." });
    } catch (error) {
      next(error);
    }
  }

  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const token = await this.authServices.signIn({
        email,
        password
      });
      return res
        .status(HTTP_STATUS.OK)
        .json({ message: "로그인이 성공하였습니다.", data: token });
    } catch (error) {
      next(error);
    }
  };
}
