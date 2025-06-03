import axios from 'axios';
import { Task } from '../types/Task';

// Use environment variable for API URL (set REACT_APP_API_URL on deploy)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to each request if exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const taskService = {
  // Lấy tất cả tasks
  getAllTasks: async (): Promise<Task[]> => {
    const response = await api.get('/tasks');
    return response.data;
  },

  // Tạo task mới
  createTask: async (title: string): Promise<Task> => {
    const response = await api.post('/tasks', { title });
    return response.data;
  },

  // Cập nhật task
  updateTask: async (id: string, completed: boolean): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, { completed });
    return response.data;
  },

  // Xóa task
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
