import { Router } from "express";
import todoRoutes from "./todo.routes.js";
import subtodoRoutes from "./subtodo.routes.js";
import trashRoutes from "./trash.routes.js";

const router = Router();

// API 라우트 등록
router.use("/todos", todoRoutes);
router.use("/todos", subtodoRoutes);
router.use("/trash", trashRoutes);

export default router;
