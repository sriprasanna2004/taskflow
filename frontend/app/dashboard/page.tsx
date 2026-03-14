'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import TaskCard from '@/components/TaskCard';
import TaskFiltersComponent from '@/components/TaskFilters';
import PaginationComponent from '@/components/Pagination';
import { useTasks } from '@/hooks/useTasks';
import { getMe } from '@/services/authService';
import { User, TaskStatus } from '@/types';

export default function DashboardPage() {
  const { tasks, pagination, loading, error, fetchTasks, removeTask } = useTasks();
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TaskStatus | ''>('');
  const [page, setPage] = useState(1);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    getMe().then(setUser);
  }, []);

  // When filters change, reset to page 1 and fetch immediately
  const prevFilters = useRef({ status, debouncedSearch });

  useEffect(() => {
    const filtersChanged =
      prevFilters.current.status !== status ||
      prevFilters.current.debouncedSearch !== debouncedSearch;

    prevFilters.current = { status, debouncedSearch };

    if (filtersChanged) {
      // Reset page and fetch with page=1 directly to avoid stale page state
      setPage(1);
      fetchTasks({ page: 1, limit: 9, status: status || undefined, search: debouncedSearch || undefined });
    } else {
      fetchTasks({ page, limit: 9, status: status || undefined, search: debouncedSearch || undefined });
    }
  }, [fetchTasks, page, status, debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      await removeTask(id);
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
            {pagination && (
              <p className="text-sm text-gray-500 mt-0.5">{pagination.total} total tasks</p>
            )}
          </div>
          <Link
            href="/create-task"
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            New Task
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <TaskFiltersComponent
            search={search}
            status={status}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
          />
        </div>

        {/* Content */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 h-32 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-16 text-red-500">{error}</div>
        )}

        {!loading && !error && tasks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No tasks found.</p>
            <Link href="/create-task" className="text-indigo-600 text-sm mt-2 inline-block hover:underline">
              Create your first task
            </Link>
          </div>
        )}

        {!loading && tasks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {pagination && (
          <PaginationComponent pagination={pagination} onPageChange={setPage} />
        )}
      </main>
    </div>
  );
}
