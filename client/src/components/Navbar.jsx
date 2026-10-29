import React from 'react';

export const Navbar = ({ isConnected, onOpenNewTask }) => {
  return (
    <header className="navbar" role="banner">
      <div className="navbar-container">
        <div className="brand">
          <div className="brand-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <h1 className="brand-title">TaskFlow Pro</h1>
            <p className="brand-subtitle">MERN Stack • CI/CD Automated</p>
          </div>
        </div>

        <div className="nav-actions">
          <div
            className="system-status-badge"
            role="status"
            aria-label={isConnected ? 'Backend API Connected' : 'Connecting to API'}
            style={
              !isConnected
                ? {
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#f87171',
                    borderColor: 'rgba(239, 68, 68, 0.25)',
                  }
                : {}
            }
          >
            <span
              className="system-status-dot"
              style={!isConnected ? { background: '#ef4444', boxShadow: '0 0 8px #ef4444' } : {}}
            />
            <span>{isConnected ? 'API Connected' : 'Connecting...'}</span>
          </div>

          <button
            id="btn-add-task-header"
            type="button"
            className="btn btn-primary"
            onClick={onOpenNewTask}
            aria-label="Create a new task"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
