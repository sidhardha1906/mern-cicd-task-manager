/**
 * API Service for MERN CI/CD Task Manager
 * Communicates with the Express REST API backend using configurable VITE_API_URL
 */

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

/**
 * Generic fetch wrapper with timeout, JSON parsing, and unified error handling
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        (data && (data.message || (data.errors && data.errors.join(', ')))) ||
        `HTTP Error ${response.status}: ${response.statusText}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(
        `Network error: Unable to connect to backend server at ${API_BASE_URL}. Ensure the server is running.`
      );
    }
    throw error;
  }
};

export const apiService = {
  /**
   * Health check
   */
  getHealth: async () => {
    return request('/health');
  },

  /**
   * Fetch all tasks with optional filters
   * @param {Object} [filters] - { status, priority, search }
   */
  getTasks: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters.priority && filters.priority !== 'all') {
      params.append('priority', filters.priority);
    }
    if (filters.search && filters.search.trim()) {
      params.append('search', filters.search.trim());
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/tasks${queryString}`);
  },

  /**
   * Fetch single task by ID
   */
  getTaskById: async (id) => {
    return request(`/tasks/${id}`);
  },

  /**
   * Create a new task
   */
  createTask: async (taskData) => {
    return request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Update existing task
   */
  updateTask: async (id, taskData) => {
    return request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Update task status (completed/pending)
   */
  updateTaskStatus: async (id, status) => {
    return request(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Delete a task
   */
  deleteTask: async (id) => {
    return request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

export default apiService;
