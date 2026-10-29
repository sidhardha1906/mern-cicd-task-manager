const Task = require('../models/Task');
const mongoose = require('mongoose');

/**
 * @desc    Get all tasks with optional filtering & search
 * @route   GET /api/tasks
 * @access  Public
 */
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, q } = req.query;
    const filter = {};

    // Filter by status if provided
    if (status && ['pending', 'completed'].includes(status.toLowerCase())) {
      filter.status = status.toLowerCase();
    }

    // Filter by priority if provided
    if (priority && ['low', 'medium', 'high'].includes(priority.toLowerCase())) {
      filter.priority = priority.toLowerCase();
    }

    // Search query for title or description
    const searchTerm = search || q;
    if (searchTerm && searchTerm.trim() !== '') {
      const sanitized = searchTerm.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: sanitized, $options: 'i' } },
        { description: { $regex: sanitized, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single task by ID
 * @route   GET /api/tasks/:id
 * @access  Public
 */
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid task ID format: '${id}'`,
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task with ID '${id}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Public
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const taskData = {
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status ? status.toLowerCase() : 'pending',
      priority: priority ? priority.toLowerCase() : 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
    };

    const task = await Task.create(taskData);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update task details
 * @route   PUT /api/tasks/:id
 * @access  Public
 */
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid task ID format: '${id}'`,
      });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task with ID '${id}' not found`,
      });
    }

    const { title, description, status, priority, dueDate } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description ? description.trim() : '';
    if (status !== undefined) task.status = status.toLowerCase();
    if (priority !== undefined) task.priority = priority.toLowerCase();
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update task status only
 * @route   PATCH /api/tasks/:id/status
 * @access  Public
 */
const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid task ID format: '${id}'`,
      });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task with ID '${id}' not found`,
      });
    }

    task.status = status.toLowerCase();
    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Public
 */
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid task ID format: '${id}'`,
      });
    }

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task with ID '${id}' not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
