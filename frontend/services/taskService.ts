import api from './api';
import { Task, TaskFilters, TasksResponse } from '@/types';

export const createTask = async (data: {
  title: string;
  description?: string;
  status?: string;
}): Promise<Task> => {
  const res = await api.post('/api/tasks', data);
  return res.data.data.task;
};

export const getTasks = async (filters: TaskFilters = {}): Promise<TasksResponse> => {
  // Remove undefined and empty string values from query params (keep 0 and false)
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined && v !== null)
  );
  const res = await api.get('/api/tasks', { params });
  return res.data.data;
};

export const getTask = async (id: string): Promise<Task> => {
  const res = await api.get(`/api/tasks/${id}`);
  return res.data.data.task;
};

export const updateTask = async (
  id: string,
  data: { title?: string; description?: string; status?: string }
): Promise<Task> => {
  const res = await api.put(`/api/tasks/${id}`, data);
  return res.data.data.task;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/api/tasks/${id}`);
};
