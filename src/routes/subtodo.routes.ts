import { Router } from "express";
import { createSubTodo, updateSubTodo, deleteSubTodo } from "../controllers/index.js";
import { validateBody, validateParams } from "../middlewares/index.js";
import { createSubTodoSchema, updateSubTodoSchema, idParamSchema, subTodoIdParamSchema } from "../schemas/index.js";

const router = Router();

// POST /todos/:id/subtodos - 서브 Todo 생성
router.post("/:id/subtodos", validateParams(idParamSchema), validateBody(createSubTodoSchema), createSubTodo);

// PUT /todos/:id/subtodos/:subId - 서브 Todo 수정
router.put("/:id/subtodos/:subId", validateParams(subTodoIdParamSchema), validateBody(updateSubTodoSchema), updateSubTodo);

// DELETE /todos/:id/subtodos/:subId - 서브 Todo 삭제
router.delete("/:id/subtodos/:subId", validateParams(subTodoIdParamSchema), deleteSubTodo);

export default router;

