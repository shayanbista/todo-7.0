import Joi from "joi";

export const createTaskBodySchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Title must be a string",
  }),
  isCompleted: Joi.boolean().optional().messages({
    "boolean.base": "isCompleted must be a boolean",
  }),
}).options({ stripUnknown: true });

export const getTaskrQuerySchema = Joi.object({
  q: Joi.string().optional(),
  page: Joi.number()
    .min(1)
    .optional()
    .messages({
      "number.base": "Page must be a number",
      "number.min": "Page must be at least 1",
    })
    .default(1),
});

export const updateTaskBodySchema = Joi.object({
  title: Joi.string().optional().messages({
    "any.required": "Title must be a string",
  }),
  isCompleted: Joi.boolean().optional().messages({
    "boolean.base": "isCompleted must be a boolean",
  }),
}).options({ stripUnknown: true });

export const taskIdSchema = Joi.object({
  id: Joi.number().required().messages({
    "number.base": "Id must be a number",
    "any.required": "Id is required",
  }),
}).options({ stripUnknown: true });
