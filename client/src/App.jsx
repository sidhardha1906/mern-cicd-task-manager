import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import TaskFilterBar from './components/TaskFilterBar';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import apiService from './services/api';

export const App = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: '',
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal state
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Health check to verify backend connectivity
  const checkHealth = useCallback(async () => {
    try {
      const res = await apiService.getHealth();
      setIsConnected(res && res.status === 'healthy');
    } catch {
      setIsConnected(false);
    }
  }, []);

  // Fetch tasks according to current filters
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getTasks(filters);
      if (response && response.success) {
        setTasks(response.data || []);
      } else {
        setTasks([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server');
      showToast(err.message || 'Failed to fetch tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filter change handlers
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      search: '',
    });
  };

  // Task creation and update handler
  const handleSaveTask = async (taskData) => {
    setIsSaving(true);
    try {
      if (editingTask) {
        const id = editingTask._id || editingTask.id;
        const res = await apiService.updateTask(id, taskData);
        showToast('Task updated successfully!', 'success');
        setTasks((prev) =>
          prev.map((t) => ((t._id || t.id) === id ? res.data : t))
        );
      } else {
        const res = await apiService.createTask(taskData);
        showToast('Task created successfully!', 'success');
        setTasks((prev) => [res.data, ...prev]);
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      showToast(err.message || 'Failed to save task', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle status between completed and pending
  const handleToggleStatus = async (task) => {
    const id = task._id || task.id;
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => ((t._id || t.id) === id ? { ...t, status: newStatus } : t))
    );

    try {
      await apiService.updateTaskStatus(id, newStatus);
      showToast(
        `Task marked as ${newStatus}!`,
        'success'
      );
    } catch (err) {
      // Revert if API call fails
      setTasks((prev) =>
        prev.map((t) => ((t._id || t.id) === id ? { ...t, status: task.status } : t))
      );
      showToast(err.message || 'Failed to update task status', 'error');
    }
  };

  // Delete task handler
  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      await apiService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => (t._id || t.id) !== id));
      showToast('Task deleted successfully!', 'success');
      setDeletingTask(null);
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const isFiltered =
    filters.status !== 'all' || filters.priority !== 'all' || filters.search.trim().length > 0;

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        isConnected={isConnected}
        onOpenNewTask={() => {
          setEditingTask(null);
          setIsModalOpen(true);
        }}
      />

      {/* Main Dashboard */}
      <main className="main-content" role="main">
        {/* Statistics Cards */}
        <StatsCards tasks={tasks} />

        {/* Search & Filter Toolbar */}
        <TaskFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        {/* Task List / Empty State / Spinner */}
        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          isFiltered={isFiltered}
          onToggleStatus={handleToggleStatus}
          onEdit={(task) => {
            setEditingTask(task);
            setIsModalOpen(true);
          }}
          onDelete={(task) => setDeletingTask(task)}
          onOpenNewTask={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          onRetry={fetchTasks}
        />
      </main>

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
        isSaving={isSaving}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
        task={deletingTask}
        isDeleting={isDeleting}
      />

      {/* Floating Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <p>
          TaskFlow Pro &copy; {new Date().getFullYear()} • MERN Stack CI/CD Portfolio Project • Automated with GitHub Actions
        </p>
      </footer>
    </div>
  );
};

export default App;
