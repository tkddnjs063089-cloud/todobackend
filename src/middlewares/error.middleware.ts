import { Request, Response, NextFunction } from "express";

// 에러 핸들러 미들웨어
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  res.status(500).json({
    success: false,
    message: "서버 내부 오류가 발생했습니다",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

// 404 Not Found 미들웨어
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "요청한 리소스를 찾을 수 없습니다",
  });
};

