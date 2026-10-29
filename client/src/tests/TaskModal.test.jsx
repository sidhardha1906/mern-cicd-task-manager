import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskModal from '../components/TaskModal';

describe('TaskModal Component', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <TaskModal isOpen={false} onClose={vi.fn()} onSave={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders creation form when isOpen is true', () => {
    render(<TaskModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />);

    expect(screen.getByRole('heading', { name: /create new task/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
  });

  it('validates title field on empty submit and displays error', () => {
    const handleSave = vi.fn();
    render(<TaskModal isOpen={true} onClose={vi.fn()} onSave={handleSave} />);

    const submitBtn = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitBtn);

    expect(handleSave).not.toHaveBeenCalled();
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
  });

  it('validates title minimum length of 3 characters', () => {
    const handleSave = vi.fn();
    render(<TaskModal isOpen={true} onClose={vi.fn()} onSave={handleSave} />);

    const titleInput = screen.getByLabelText(/task title/i);
    fireEvent.change(titleInput, { target: { value: 'AB' } });

    const submitBtn = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitBtn);

    expect(handleSave).not.toHaveBeenCalled();
    expect(screen.getByText(/title must be at least 3 characters/i)).toBeInTheDocument();
  });

  it('calls onSave with valid input data', () => {
    const handleSave = vi.fn();
    render(<TaskModal isOpen={true} onClose={vi.fn()} onSave={handleSave} />);

    const titleInput = screen.getByLabelText(/task title/i);
    const descInput = screen.getByLabelText(/description/i);
    const prioritySelect = screen.getByLabelText(/priority/i);

    fireEvent.change(titleInput, { target: { value: 'Deploy Application' } });
    fireEvent.change(descInput, { target: { value: 'Deploy frontend to Vercel and backend to Render' } });
    fireEvent.change(prioritySelect, { target: { value: 'high' } });

    const submitBtn = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitBtn);

    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Deploy Application',
        description: 'Deploy frontend to Vercel and backend to Render',
        priority: 'high',
      })
    );
  });

  it('pre-fills existing task data in edit mode', () => {
    const existingTask = {
      _id: 'task-123',
      title: 'Fix MongoDB Atlas connection',
      description: 'Configure IP access list and user credentials',
      priority: 'high',
      status: 'pending',
    };

    render(
      <TaskModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        task={existingTask}
      />
    );

    expect(screen.getByRole('heading', { name: /edit task/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/task title/i)).toHaveValue('Fix MongoDB Atlas connection');
    expect(screen.getByLabelText(/description/i)).toHaveValue('Configure IP access list and user credentials');
    expect(screen.getByRole('button', { name: /update task/i })).toBeInTheDocument();
  });
});
