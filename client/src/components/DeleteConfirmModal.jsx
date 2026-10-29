import React from 'react';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, task, isDeleting = false }) => {
  if (!isOpen || !task) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h2 id="delete-modal-title" className="modal-title" style={{ color: '#ef4444' }}>
            Delete Task
          </h2>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>&ldquo;{task.title}&rdquo;</strong>?
          This action cannot be undone.
        </p>

        <div className="modal-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            id="btn-confirm-delete"
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(task._id || task.id)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
