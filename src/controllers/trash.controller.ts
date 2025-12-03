import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 휴지통 목록 조회 (삭제된 Todo들)
export const getTrash = async (req: Request, res: Response) => {
  try {
    const deletedTodos = await prisma.todo.findMany({
      where: { deletedAt: { not: null } },
      include: { subTodos: true },
      orderBy: { deletedAt: "desc" },
    });

    const deletedSubTodos = await prisma.subTodo.findMany({
      where: { 
        deletedAt: { not: null },
        todo: { deletedAt: null } // 부모가 삭제 안 된 경우만
      },
      orderBy: { deletedAt: "desc" },
    });

    const trashItems = [
      ...deletedTodos.map((todo) => ({
        id: todo.id,
        type: "todo" as const,
        text: todo.text,
        completed: todo.completed,
        date: todo.date,
        subTodos: todo.subTodos.map((s) => ({ id: s.id, text: s.text, completed: s.completed })),
        deletedAt: todo.deletedAt!.toISOString(),
      })),
      ...deletedSubTodos.map((sub) => ({
        id: sub.id,
        type: "subTodo" as const,
        originalTodoId: sub.todoId,
        text: sub.text,
        completed: sub.completed,
        date: null,
        subTodos: [],
        deletedAt: sub.deletedAt!.toISOString(),
      })),
    ].sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime());

    res.json({ success: true, data: trashItems });
  } catch (error) {
    console.error("getTrash error:", error);
    res.status(500).json({ success: false, message: "휴지통을 불러오는데 실패했습니다" });
  }
};

// Todo 복원
export const restoreTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo || !todo.deletedAt) {
      return res.status(404).json({ success: false, message: "삭제된 할 일을 찾을 수 없습니다" });
    }

    // Todo와 모든 SubTodo 복원
    await prisma.todo.update({
      where: { id },
      data: { deletedAt: null },
    });

    await prisma.subTodo.updateMany({
      where: { todoId: id },
      data: { deletedAt: null },
    });

    res.json({ success: true, message: "복원되었습니다" });
  } catch (error) {
    console.error("restoreTodo error:", error);
    res.status(500).json({ success: false, message: "복원에 실패했습니다" });
  }
};

// SubTodo 복원
export const restoreSubTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const subTodo = await prisma.subTodo.findUnique({ where: { id } });
    if (!subTodo || !subTodo.deletedAt) {
      return res.status(404).json({ success: false, message: "삭제된 하위 할 일을 찾을 수 없습니다" });
    }

    await prisma.subTodo.update({
      where: { id },
      data: { deletedAt: null },
    });

    res.json({ success: true, message: "복원되었습니다" });
  } catch (error) {
    console.error("restoreSubTodo error:", error);
    res.status(500).json({ success: false, message: "복원에 실패했습니다" });
  }
};

// Todo 영구 삭제
export const permanentDeleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.todo.delete({ where: { id } });

    res.json({ success: true, message: "영구 삭제되었습니다" });
  } catch (error) {
    console.error("permanentDeleteTodo error:", error);
    res.status(500).json({ success: false, message: "영구 삭제에 실패했습니다" });
  }
};

// SubTodo 영구 삭제
export const permanentDeleteSubTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.subTodo.delete({ where: { id } });

    res.json({ success: true, message: "영구 삭제되었습니다" });
  } catch (error) {
    console.error("permanentDeleteSubTodo error:", error);
    res.status(500).json({ success: false, message: "영구 삭제에 실패했습니다" });
  }
};

// 휴지통 비우기
export const emptyTrash = async (req: Request, res: Response) => {
  try {
    // 삭제된 SubTodo 먼저 삭제
    await prisma.subTodo.deleteMany({
      where: { deletedAt: { not: null } },
    });

    // 삭제된 Todo 삭제
    await prisma.todo.deleteMany({
      where: { deletedAt: { not: null } },
    });

    res.json({ success: true, message: "휴지통을 비웠습니다" });
  } catch (error) {
    console.error("emptyTrash error:", error);
    res.status(500).json({ success: false, message: "휴지통 비우기에 실패했습니다" });
  }
};


