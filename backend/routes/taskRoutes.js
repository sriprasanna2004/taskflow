const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
} = require('../utils/validators');

// All task routes require authentication
router.use(protect);

router.post('/', validate(createTaskSchema), createTask);
router.get('/', validate(taskQuerySchema, 'query'), getTasks);
router.get('/:id', getTask);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
