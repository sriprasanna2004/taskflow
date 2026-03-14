'use client';

import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { Task } from '@/types';
import { cn } from '@/utils/cn';

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
};

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onDelete }: TaskCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        <span
          className={cn(
            'text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap',
            statusStyles[task.status]
          )}
        >
          {task.status}
        </span>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-gray-400">
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <Link
            href={`/edit-task/${task._id}`}
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            aria-label="Edit task"
          >
            <Pencil size={15} />
          </Link>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label="Delete task"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
