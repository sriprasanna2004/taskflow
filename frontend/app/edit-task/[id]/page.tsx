'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import TaskForm from '@/components/TaskForm';
import { getTask, updateTask } from '@/services/taskService';
import { getMe } from '@/services/authService';
import { Task, User } from '@/types';

export default function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTask(id), getMe()]).then(([t, u]) => {
      if (!u) {
        router.push('/login');
        return;
      }
      setTask(t);
      setUser(u);
      setLoading(false);
    }).catch(() => {
      toast.error('Task not found');
      router.push('/dashboard');
    });
  }, [id, router]);

  const handleSubmit = async (data: { title: string; description: string; status: string }) => {
    await updateTask(id, data);
    toast.success('Task updated!');
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={null} />
        <div className="max-w-xl mx-auto px-4 py-10">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <main className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Task</h1>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          {task && (
            <TaskForm
              initialData={task}
              onSubmit={handleSubmit}
              submitLabel="Save Changes"
            />
          )}
        </div>
      </main>
    </div>
  );
}
