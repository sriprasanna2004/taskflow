import { useState, useCallback } from 'react';
import { Task, TaskFilters, Pagination } from '@/types';
import * as taskService from '@/services/taskService';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (filters: TaskFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks(filters);
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeTask = useCallback(async (id: string) => {
    await taskService.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  }, []);

  return { tasks, pagination, loading, error, fetchTasks, removeTask };
};
