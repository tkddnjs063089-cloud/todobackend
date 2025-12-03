import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middlewares";

// 환경 변수 로드
dotenv.config();

// Express 앱 초기화
const app: Application = express();
const PORT = process.env.PORT || 3001;

// 미들웨어
app.use(cors());
app.use(express.json());

// 헬스 체크
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Todo Backend API is running!",
    version: "1.0.0",
  });
});

// API 라우트
app.use("/api", routes);

// 404 핸들러
app.use(notFoundHandler);

// 에러 핸들러
app.use(errorHandler);

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
});
