const Task = require('../models/Task');

/**
 * Create a new task for a user
 */
const createTask = async (userId, data) => {
  return Task.create({ ...data, userId });
};

/**
 * Escape special regex characters to prevent ReDoS attacks
 */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Get paginated, filtered, searchable tasks for a user
 */
const getTasks = async (userId, { page = 1, limit = 10, status, search }) => {
  const query = { userId };

  if (status) query.status = status;

  if (search) {
    // Escape user input before using in regex to prevent ReDoS
    query.title = { $regex: escapeRegex(search), $options: 'i' };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [tasks, total] = await Promise.all([
    Task.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Task.countDocuments(query),
  ]);

  return {
    tasks,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * Get a single task — ensures ownership
 */
const getTaskById = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) {
    const err = new Error('Task not found.');
    err.statusCode = 404;
    throw err;
  }
  return task;
};

/**
 * Update a task — ensures ownership
 */
const updateTask = async (taskId, userId, data) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, userId },
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!task) {
    const err = new Error('Task not found.');
    err.statusCode = 404;
    throw err;
  }
  return task;
};

/**
 * Delete a task — ensures ownership
 */
const deleteTask = async (taskId, userId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, userId });
  if (!task) {
    const err = new Error('Task not found.');
    err.statusCode = 404;
    throw err;
  }
  return task;
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
