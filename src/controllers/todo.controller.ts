import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ==================== 메인 Todo CRUD ====================

// 모든 Todo 조회 (서브 Todo 포함)
export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany({
      include: { subTodos: true },
      orderBy: { createdAt: "desc" },
    });

    // 프론트엔드 형식에 맞게 변환
    const formattedTodos = todos.map((todo) => ({
      id: todo.id,
      text: todo.text,
      completed: todo.completed,
      date: todo.date,
      subTodos: todo.subTodos.map((sub) => ({
        id: sub.id,
        text: sub.text,
        completed: sub.completed,
      })),
    }));

    res.json({
      success: true,
      data: formattedTodos,
    });
  } catch (error) {
    console.error("getAllTodos error:", error);
    res.status(500).json({
      success: false,
      message: "할 일 목록을 불러오는데 실패했습니다",
    });
  }
};

// 특정 Todo 조회
export const getTodoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const todo = await prisma.todo.findUnique({
      where: { id },
      include: { subTodos: true },
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "할 일을 찾을 수 없습니다",
      });
    }

    const formattedTodo = {
      id: todo.id,
      text: todo.text,
      completed: todo.completed,
      date: todo.date,
      subTodos: todo.subTodos.map((sub) => ({
        id: sub.id,
        text: sub.text,
        completed: sub.completed,
      })),
    };

    res.json({
      success: true,
      data: formattedTodo,
    });
  } catch (error) {
    console.error("getTodoById error:", error);
    res.status(500).json({
      success: false,
      message: "할 일을 불러오는데 실패했습니다",
    });
  }
};

// Todo 생성
export const createTodo = async (req: Request, res: Response) => {
  try {
    const { text, date } = req.body;

    const todo = await prisma.todo.create({
      data: {
        text,
        date: date || null,
      },
      include: { subTodos: true },
    });

    const formattedTodo = {
      id: todo.id,
      text: todo.text,
      completed: todo.completed,
      date: todo.date,
      subTodos: [],
    };

    res.status(201).json({
      success: true,
      message: "할 일이 생성되었습니다",
      data: formattedTodo,
    });
  } catch (error) {
    console.error("createTodo error:", error);
    res.status(500).json({
      success: false,
      message: "할 일 생성에 실패했습니다",
    });
  }
};

// Todo 수정
export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text, completed, date } = req.body;

    // 존재 여부 확인
    const existingTodo = await prisma.todo.findUnique({ where: { id } });
    if (!existingTodo) {
      return res.status(404).json({
        success: false,
        message: "할 일을 찾을 수 없습니다",
      });
    }

    // 메인 Todo 완료 시 서브 Todo도 함께 업데이트
    const updateData: { text?: string; completed?: boolean; date?: string | null } = {};
    if (text !== undefined) updateData.text = text;
    if (date !== undefined) updateData.date = date;
    if (completed !== undefined) updateData.completed = completed;

    const todo = await prisma.todo.update({
      where: { id },
      data: updateData,
      include: { subTodos: true },
    });

    // completed가 변경되었으면 모든 서브 Todo도 같이 업데이트
    if (completed !== undefined) {
      await prisma.subTodo.updateMany({
        where: { todoId: id },
        data: { completed },
      });
    }

    // 업데이트된 데이터 다시 조회
    const updatedTodo = await prisma.todo.findUnique({
      where: { id },
      include: { subTodos: true },
    });

    const formattedTodo = {
      id: updatedTodo!.id,
      text: updatedTodo!.text,
      completed: updatedTodo!.completed,
      date: updatedTodo!.date,
      subTodos: updatedTodo!.subTodos.map((sub) => ({
        id: sub.id,
        text: sub.text,
        completed: sub.completed,
      })),
    };

    res.json({
      success: true,
      message: "할 일이 수정되었습니다",
      data: formattedTodo,
    });
  } catch (error) {
    console.error("updateTodo error:", error);
    res.status(500).json({
      success: false,
      message: "할 일 수정에 실패했습니다",
    });
  }
};

// Todo 삭제
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 존재 여부 확인
    const existingTodo = await prisma.todo.findUnique({ where: { id } });
    if (!existingTodo) {
      return res.status(404).json({
        success: false,
        message: "할 일을 찾을 수 없습니다",
      });
    }

    // Cascade로 서브 Todo도 함께 삭제됨
    await prisma.todo.delete({ where: { id } });

    res.json({
      success: true,
      message: "할 일이 삭제되었습니다",
    });
  } catch (error) {
    console.error("deleteTodo error:", error);
    res.status(500).json({
      success: false,
      message: "할 일 삭제에 실패했습니다",
    });
  }
};

// ==================== 서브 Todo CRUD ====================

// 서브 Todo 생성
export const createSubTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // 부모 Todo ID
    const { text } = req.body;

    // 부모 Todo 존재 여부 확인
    const parentTodo = await prisma.todo.findUnique({ where: { id } });
    if (!parentTodo) {
      return res.status(404).json({
        success: false,
        message: "부모 할 일을 찾을 수 없습니다",
      });
    }

    const subTodo = await prisma.subTodo.create({
      data: {
        text,
        todoId: id,
      },
    });

    res.status(201).json({
      success: true,
      message: "서브 할 일이 생성되었습니다",
      data: {
        id: subTodo.id,
        text: subTodo.text,
        completed: subTodo.completed,
      },
    });
  } catch (error) {
    console.error("createSubTodo error:", error);
    res.status(500).json({
      success: false,
      message: "서브 할 일 생성에 실패했습니다",
    });
  }
};

// 서브 Todo 수정 (토글 포함)
export const updateSubTodo = async (req: Request, res: Response) => {
  try {
    const { id, subId } = req.params;
    const { text, completed } = req.body;

    // 서브 Todo 존재 여부 확인
    const existingSubTodo = await prisma.subTodo.findFirst({
      where: { id: subId, todoId: id },
    });

    if (!existingSubTodo) {
      return res.status(404).json({
        success: false,
        message: "서브 할 일을 찾을 수 없습니다",
      });
    }

    const updateData: { text?: string; completed?: boolean } = {};
    if (text !== undefined) updateData.text = text;
    if (completed !== undefined) updateData.completed = completed;

    const subTodo = await prisma.subTodo.update({
      where: { id: subId },
      data: updateData,
    });

    // 모든 서브 Todo가 완료되었는지 확인하고 부모 Todo 업데이트
    const allSubTodos = await prisma.subTodo.findMany({
      where: { todoId: id },
    });

    const allCompleted = allSubTodos.length > 0 && allSubTodos.every((sub) => sub.completed);

    await prisma.todo.update({
      where: { id },
      data: { completed: allCompleted },
    });

    res.json({
      success: true,
      message: "서브 할 일이 수정되었습니다",
      data: {
        id: subTodo.id,
        text: subTodo.text,
        completed: subTodo.completed,
      },
    });
  } catch (error) {
    console.error("updateSubTodo error:", error);
    res.status(500).json({
      success: false,
      message: "서브 할 일 수정에 실패했습니다",
    });
  }
};

// 서브 Todo 삭제
export const deleteSubTodo = async (req: Request, res: Response) => {
  try {
    const { id, subId } = req.params;

    // 서브 Todo 존재 여부 확인
    const existingSubTodo = await prisma.subTodo.findFirst({
      where: { id: subId, todoId: id },
    });

    if (!existingSubTodo) {
      return res.status(404).json({
        success: false,
        message: "서브 할 일을 찾을 수 없습니다",
      });
    }

    await prisma.subTodo.delete({ where: { id: subId } });

    res.json({
      success: true,
      message: "서브 할 일이 삭제되었습니다",
    });
  } catch (error) {
    console.error("deleteSubTodo error:", error);
    res.status(500).json({
      success: false,
      message: "서브 할 일 삭제에 실패했습니다",
    });
  }
};

