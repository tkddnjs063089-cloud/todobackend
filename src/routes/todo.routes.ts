import { Router } from "express";
import { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo } from "../controllers";
import { validateBody, validateParams } from "../middlewares";
import { createTodoSchema, updateTodoSchema, idParamSchema } from "../schemas";

const router = Router();

// GET /todos - 모든 Todo 조회
router.get("/", getAllTodos);

// GET /todos/:id - 특정 Todo 조회
router.get("/:id", validateParams(idParamSchema), getTodoById);

// POST /todos - Todo 생성
router.post("/", validateBody(createTodoSchema), createTodo);

// PUT /todos/:id - Todo 수정
router.put("/:id", validateParams(idParamSchema), validateBody(updateTodoSchema), updateTodo);

// DELETE /todos/:id - Todo 삭제
router.delete("/:id", validateParams(idParamSchema), deleteTodo);

export default router;
