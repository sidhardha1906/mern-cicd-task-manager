import React from 'react';
import TaskItem from './TaskItem';
import EmptyState from './EmptyState';

export const TaskList = ({
  tasks,
  loading,
  error,
  isFiltered,
  onToggleStatus,
  onEdit,
  onDelete,
  onOpenNewTask,
  onRetry,
}) => {
  if (loading) {
    return (
      <div className="spinner-wrapper" data-testid="loading-indicator">
        <div className="spinner" />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Loading your tasks...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="empty-state"
        style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}
        role="alert"
        data-testid="error-state"
      >
        <div
          className="empty-icon"
          style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2 className="empty-title">Failed to load tasks</h2>
        <p className="empty-desc">{error}</p>
        {onRetry && (
          <button type="button" className="btn btn-secondary" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (tasks.length === 0) {
    return <EmptyState onOpenNewTask={onOpenNewTask} isFiltered={isFiltered} />;
  }

  return (
    <div className="task-list" role="feed" aria-label="Tasks List">
      {tasks.map((task) => (
        <TaskItem
          key={task._id || task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
