import React from 'react';

export const TaskFilterBar = ({ filters, onFilterChange, onResetFilters }) => {
  const isFilterActive =
    filters.status !== 'all' || filters.priority !== 'all' || filters.search.trim().length > 0;

  return (
    <div className="action-bar" role="search" aria-label="Task Filters and Search">
      <div className="search-filter-group">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <span className="search-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            id="task-search-input"
            type="search"
            className="search-input"
            placeholder="Search tasks by title or details..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            aria-label="Search tasks"
          />
        </div>

        {/* Status Filter */}
        <label htmlFor="filter-status-select" className="visually-hidden" style={{ display: 'none' }}>
          Filter by Status
        </label>
        <select
          id="filter-status-select"
          className="select-filter"
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          aria-label="Filter tasks by completion status"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        {/* Priority Filter */}
        <label htmlFor="filter-priority-select" className="visually-hidden" style={{ display: 'none' }}>
          Filter by Priority
        </label>
        <select
          id="filter-priority-select"
          className="select-filter"
          value={filters.priority}
          onChange={(e) => onFilterChange('priority', e.target.value)}
          aria-label="Filter tasks by priority level"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>

        {/* Reset button if active */}
        {isFilterActive && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onResetFilters}
            aria-label="Clear active search and filters"
            style={{ padding: '0.65rem 0.875rem' }}
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskFilterBar;
