const Joi = require('joi');

// Auth schemas
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).max(128).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});

// Task schemas
const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().trim().max(2000).allow('').default(''),
  status: Joi.string().valid('pending', 'in-progress', 'completed').default('pending'),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200),
  description: Joi.string().trim().max(2000).allow(''),
  status: Joi.string().valid('pending', 'in-progress', 'completed'),
}).min(1); // at least one field required

const taskQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('pending', 'in-progress', 'completed').optional(),
  search: Joi.string().trim().max(200).optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
};
