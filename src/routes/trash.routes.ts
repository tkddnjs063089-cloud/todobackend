import { Router } from "express";
import { getTrash, restoreTodo, restoreSubTodo, permanentDeleteTodo, permanentDeleteSubTodo, emptyTrash } from "../controllers/index.js";

const router = Router();

// GET /trash - 휴지통 조회
router.get("/", getTrash);

// POST /trash/todos/:id/restore - Todo 복원
router.post("/todos/:id/restore", restoreTodo);

// POST /trash/subtodos/:id/restore - SubTodo 복원
router.post("/subtodos/:id/restore", restoreSubTodo);

// DELETE /trash/todos/:id - Todo 영구 삭제
router.delete("/todos/:id", permanentDeleteTodo);

// DELETE /trash/subtodos/:id - SubTodo 영구 삭제
router.delete("/subtodos/:id", permanentDeleteSubTodo);

// DELETE /trash - 휴지통 비우기
router.delete("/", emptyTrash);

export default router;


