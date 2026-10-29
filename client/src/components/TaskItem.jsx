import React from 'react';

export const TaskItem = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const isCompleted = task.status === 'completed';

  // Format due date if present
  let formattedDate = null;
  let isOverdue = false;

  if (task.dueDate) {
    const due = new Date(task.dueDate);
    if (!isNaN(due.getTime())) {
      formattedDate = due.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      // Check if overdue
      if (!isCompleted && due < new Date()) {
        isOverdue = true;
      }
    }
  }

  return (
    <article
      className={`task-card ${isCompleted ? 'completed' : ''}`}
      aria-label={`Task: ${task.title}`}
      data-testid={`task-item-${task._id || task.id}`}
    >
      {/* Checkbox status toggle */}
      <div className="task-checkbox-container">
        <input
          id={`task-check-${task._id || task.id}`}
          type="checkbox"
          className="task-checkbox"
          checked={isCompleted}
          onChange={() => onToggleStatus(task)}
          aria-label={`Mark task '${task.title}' as ${isCompleted ? 'pending' : 'completed'}`}
        />
      </div>

      {/* Task Content */}
      <div className="task-content">
        <div className="task-header">
          <h3 className="task-title">{task.title}</h3>
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-footer">
          {/* Status Badge */}
          <span className={`badge badge-status ${task.status}`}>
            {task.status}
          </span>

          {/* Priority Badge */}
          <span className={`badge badge-priority ${task.priority}`}>
            {task.priority} priority
          </span>

          {/* Due Date Indicator */}
          {formattedDate && (
            <span
              className={`due-date-pill ${isOverdue ? 'overdue' : ''}`}
              title={isOverdue ? 'This task is past its due date!' : 'Due date'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{formattedDate} {isOverdue && '(Overdue)'}</span>
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons: Edit and Delete */}
      <div className="task-actions">
        <button
          type="button"
          className="btn-icon"
          onClick={() => onEdit(task)}
          aria-label={`Edit task '${task.title}'`}
          title="Edit Task"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>

        <button
          type="button"
          className="btn-icon delete"
          onClick={() => onDelete(task)}
          aria-label={`Delete task '${task.title}'`}
          title="Delete Task"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    </article>
  );
};

export default TaskItem;
