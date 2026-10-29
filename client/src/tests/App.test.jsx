import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import apiService from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    getHealth: vi.fn(),
    getTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    updateTaskStatus: vi.fn(),
    deleteTask: vi.fn(),
  },
}));

describe('App Dashboard Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard with navbar, stats, and handles empty tasks state', async () => {
    apiService.getHealth.mockResolvedValue({ status: 'healthy' });
    apiService.getTasks.mockResolvedValue({ success: true, data: [] });

    render(<App />);

    // Check branding
    expect(screen.getByText('TaskFlow Pro')).toBeInTheDocument();
    expect(screen.getByText('New Task')).toBeInTheDocument();

    // Check loading indicator appears then disappears
    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });

    expect(screen.getByText(/no tasks created yet/i)).toBeInTheDocument();
  });

  it('displays fetched tasks list successfully', async () => {
    const mockTasks = [
      {
        _id: 'task-1',
        title: 'Build CI/CD with GitHub Actions',
        description: 'Automate build, test, and deployment checks',
        status: 'completed',
        priority: 'high',
      },
      {
        _id: 'task-2',
        title: 'Write Academic Project Report',
        description: 'Document architecture, design decisions, and testing',
        status: 'pending',
        priority: 'medium',
      },
    ];

    apiService.getHealth.mockResolvedValue({ status: 'healthy' });
    apiService.getTasks.mockResolvedValue({ success: true, data: mockTasks });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Build CI/CD with GitHub Actions')).toBeInTheDocument();
      expect(screen.getByText('Write Academic Project Report')).toBeInTheDocument();
    });

    // Check stats updated
    expect(screen.getByTestId('stat-total')).toHaveTextContent('2');
    expect(screen.getByTestId('stat-completed')).toHaveTextContent('1');
    expect(screen.getByTestId('stat-pending')).toHaveTextContent('1');
    expect(screen.getByTestId('stat-rate')).toHaveTextContent('50%');
  });

  it('displays error state if tasks fetch fails', async () => {
    apiService.getHealth.mockResolvedValue({ status: 'healthy' });
    apiService.getTasks.mockRejectedValue(new Error('Network connection timeout'));

    render(<App />);

    await waitFor(() => {
      const errorCard = screen.getByTestId('error-state');
      expect(errorCard).toBeInTheDocument();
      expect(errorCard).toHaveTextContent(/failed to load tasks/i);
      expect(errorCard).toHaveTextContent(/network connection timeout/i);
    });
  });
});
