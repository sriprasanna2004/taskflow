'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import TaskForm from '@/components/TaskForm';
import { createTask } from '@/services/taskService';
import { getMe } from '@/services/authService';
import { User } from '@/types';

export default function CreateTaskPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getMe().then((u) => {
      if (!u) {
        router.push('/login');
        return;
      }
      setUser(u);
    });
  }, [router]);

  const handleSubmit = async (data: { title: string; description: string; status: string }) => {
    await createTask(data);
    toast.success('Task created!');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <main className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Task</h1>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <TaskForm onSubmit={handleSubmit} submitLabel="Create Task" />
        </div>
      </main>
    </div>
  );
}
