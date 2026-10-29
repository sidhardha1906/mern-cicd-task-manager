import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatsCards from '../components/StatsCards';

describe('StatsCards Component', () => {
  it('renders zero counts and 0% rate for empty tasks list', () => {
    render(<StatsCards tasks={[]} />);

    expect(screen.getByTestId('stat-total')).toHaveTextContent('0');
    expect(screen.getByTestId('stat-pending')).toHaveTextContent('0');
    expect(screen.getByTestId('stat-completed')).toHaveTextContent('0');
    expect(screen.getByTestId('stat-rate')).toHaveTextContent('0%');
  });

  it('calculates metrics and percentage accurately', () => {
    const mockTasks = [
      { id: '1', title: 'Task 1', status: 'completed' },
      { id: '2', title: 'Task 2', status: 'completed' },
      { id: '3', title: 'Task 3', status: 'completed' },
      { id: '4', title: 'Task 4', status: 'pending' },
    ];

    render(<StatsCards tasks={mockTasks} />);

    expect(screen.getByTestId('stat-total')).toHaveTextContent('4');
    expect(screen.getByTestId('stat-completed')).toHaveTextContent('3');
    expect(screen.getByTestId('stat-pending')).toHaveTextContent('1');
    // 3 out of 4 = 75%
    expect(screen.getByTestId('stat-rate')).toHaveTextContent('75%');
  });
});
