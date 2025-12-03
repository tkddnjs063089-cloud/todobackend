import { Router } from "express";
import todoRoutes from "./todo.routes";
import subtodoRoutes from "./subtodo.routes";
import trashRoutes from "./trash.routes";

const router = Router();

// API 라우트 등록
router.use("/todos", todoRoutes);
router.use("/todos", subtodoRoutes);
router.use("/trash", trashRoutes);

export default router;

