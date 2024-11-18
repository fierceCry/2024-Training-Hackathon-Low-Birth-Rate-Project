import express from "express";
import { ENV_KEY } from "./constants/env.constants.js";
import { router } from "./routers/index.js";
import { globalErrorHandler } from "./middlewarmies/error-handler.middleware.js";
import { HTTP_STATUS } from "./constants/http-status.constant.js";
import swaggerUi from "swagger-ui-express";
import cors from 'cors'
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('public'));

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(globalErrorHandler);

const swaggerFilePath = path.resolve(__dirname, "../openapi.json")
const swaggerSpec = JSON.parse(await fs.readFile(swaggerFilePath, "utf8"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api", (req, res) => {
  return res.status(HTTP_STATUS.OK).json({ message: "테스트 성공하였습니다." });
});

app.get("/chat-test", (req, res) => {
  res.render("index");
});

(async () => {
  try {
    app.listen(ENV_KEY.PORT, () => {
      console.log(`${ENV_KEY.PORT} 포트로 서버가 열렸습니다.`);
    });
  } catch (error) {
    console.error("서버 연결 실패하였습니다:", error);
  }
})();
