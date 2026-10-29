const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');
const {
  validateCreateTask,
  validateUpdateTask,
  validateStatusUpdate,
} = require('../middleware/validateTask');

// Base route: /api/tasks
router.route('/')
  .get(getTasks)
  .post(validateCreateTask, createTask);

router.route('/:id')
  .get(getTaskById)
  .put(validateUpdateTask, updateTask)
  .delete(deleteTask);

router.patch('/:id/status', validateStatusUpdate, updateTaskStatus);

module.exports = router;
