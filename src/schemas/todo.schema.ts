import Joi from "joi";

// 메인 Todo 생성 스키마
export const createTodoSchema = Joi.object({
  text: Joi.string().required().min(1).max(255).messages({
    "string.empty": "할 일 내용을 입력해주세요",
    "string.min": "할 일은 최소 1자 이상이어야 합니다",
    "string.max": "할 일은 최대 255자까지 입력 가능합니다",
    "any.required": "할 일 내용은 필수입니다",
  }),
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .allow(null)
    .messages({
      "string.pattern.base": "날짜 형식은 YYYY-MM-DD여야 합니다",
    }),
});

// 메인 Todo 수정 스키마
export const updateTodoSchema = Joi.object({
  text: Joi.string().min(1).max(255).messages({
    "string.empty": "할 일 내용을 입력해주세요",
    "string.min": "할 일은 최소 1자 이상이어야 합니다",
    "string.max": "할 일은 최대 255자까지 입력 가능합니다",
  }),
  completed: Joi.boolean(),
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .allow(null)
    .messages({
      "string.pattern.base": "날짜 형식은 YYYY-MM-DD여야 합니다",
    }),
});

// 서브 Todo 생성 스키마
export const createSubTodoSchema = Joi.object({
  text: Joi.string().required().min(1).max(255).messages({
    "string.empty": "서브 할 일 내용을 입력해주세요",
    "string.min": "서브 할 일은 최소 1자 이상이어야 합니다",
    "string.max": "서브 할 일은 최대 255자까지 입력 가능합니다",
    "any.required": "서브 할 일 내용은 필수입니다",
  }),
});

// 서브 Todo 수정 스키마
export const updateSubTodoSchema = Joi.object({
  text: Joi.string().min(1).max(255).messages({
    "string.empty": "서브 할 일 내용을 입력해주세요",
    "string.min": "서브 할 일은 최소 1자 이상이어야 합니다",
    "string.max": "서브 할 일은 최대 255자까지 입력 가능합니다",
  }),
  completed: Joi.boolean(),
});

// ID 파라미터 스키마
export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    "string.guid": "유효한 ID 형식이 아닙니다",
    "any.required": "ID는 필수입니다",
  }),
});

// 서브 Todo ID 파라미터 스키마
export const subTodoIdParamSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    "string.guid": "유효한 Todo ID 형식이 아닙니다",
    "any.required": "Todo ID는 필수입니다",
  }),
  subId: Joi.string().uuid().required().messages({
    "string.guid": "유효한 SubTodo ID 형식이 아닙니다",
    "any.required": "SubTodo ID는 필수입니다",
  }),
});
