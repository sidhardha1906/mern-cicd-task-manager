/**
 * Middleware for validating task creation payloads
 */
const validateCreateTask = (req, res, next) => {
  const { title, description, status, priority, dueDate } = req.body;
  const errors = [];

  // Title validation
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Task title is required');
  } else if (title.trim().length < 3) {
    errors.push('Task title must be at least 3 characters long');
  } else if (title.trim().length > 120) {
    errors.push('Task title cannot exceed 120 characters');
  }

  // Description validation (optional)
  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      errors.push('Task description must be a text string');
    } else if (description.trim().length > 1000) {
      errors.push('Task description cannot exceed 1000 characters');
    }
  }

  // Status validation (optional at creation, default is pending)
  if (status !== undefined && status !== null) {
    const validStatuses = ['pending', 'completed'];
    if (!validStatuses.includes(String(status).toLowerCase())) {
      errors.push('Status must be either "pending" or "completed"');
    }
  }

  // Priority validation (optional at creation, default is medium)
  if (priority !== undefined && priority !== null) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(String(priority).toLowerCase())) {
      errors.push('Priority must be "low", "medium", or "high"');
    }
  }

  // Due Date validation (optional)
  if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      errors.push('Due date must be a valid ISO date string');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

/**
 * Middleware for validating task update payloads
 */
const validateUpdateTask = (req, res, next) => {
  const { title, description, status, priority, dueDate } = req.body;
  const errors = [];

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Task title cannot be empty');
    } else if (title.trim().length < 3) {
      errors.push('Task title must be at least 3 characters long');
    } else if (title.trim().length > 120) {
      errors.push('Task title cannot exceed 120 characters');
    }
  }

  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      errors.push('Task description must be a text string');
    } else if (description.trim().length > 1000) {
      errors.push('Task description cannot exceed 1000 characters');
    }
  }

  if (status !== undefined) {
    const validStatuses = ['pending', 'completed'];
    if (!validStatuses.includes(String(status).toLowerCase())) {
      errors.push('Status must be either "pending" or "completed"');
    }
  }

  if (priority !== undefined) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(String(priority).toLowerCase())) {
      errors.push('Priority must be "low", "medium", or "high"');
    }
  }

  if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      errors.push('Due date must be a valid date');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

/**
 * Middleware for validating PATCH /api/tasks/:id/status
 */
const validateStatusUpdate = (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: ['Status is required'],
    });
  }

  const validStatuses = ['pending', 'completed'];
  if (!validStatuses.includes(String(status).toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: ['Status must be either "pending" or "completed"'],
    });
  }

  next();
};

module.exports = {
  validateCreateTask,
  validateUpdateTask,
  validateStatusUpdate,
};
