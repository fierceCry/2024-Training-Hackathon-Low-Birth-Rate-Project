import express from "express";
import { ENV_KEY } from "./constants/env.constants.js";
import { router } from "./routers/index.js";
import { globalErrorHandler } from "./middlewarmies/error-handler.middleware.js";
import { HTTP_STATUS } from "./constants/http-status.constant.js";
import { mongoDbConnect } from "./database/mongodb/mongodb.provide.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(globalErrorHandler);

app.get("/api", (req, res) => {
  return res.status(HTTP_STATUS.OK).json({ message: "테스트 성공하였습니다." });
});

(async () => {
  try {
    await mongoDbConnect();
    app.listen(ENV_KEY.PORT, () => {
      console.log(`${ENV_KEY.PORT} 포트로 서버가 열렸습니다.`);
    });
  } catch (error) {
    console.error("서버 연결 실패하였습니다:", error);
  }
})();
