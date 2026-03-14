const taskService = require('../services/taskService');
const { successResponse } = require('../utils/response');

/**
 * POST /api/tasks
 */
const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user._id, req.body);
    return successResponse(res, 201, 'Task created.', { task });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/tasks
 */
const getTasks = async (req, res, next) => {
  try {
    const result = await taskService.getTasks(req.user._id, req.query);
    return successResponse(res, 200, 'Tasks retrieved.', result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/tasks/:id
 */
const getTask = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user._id);
    return successResponse(res, 200, 'Task retrieved.', { task });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/tasks/:id
 */
const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.user._id, req.body);
    return successResponse(res, 200, 'Task updated.', { task });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/tasks/:id
 */
const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id, req.user._id);
    return successResponse(res, 200, 'Task deleted.');
  } catch (err) {
    next(err);
  }
};

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };
