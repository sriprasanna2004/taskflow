'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, CheckSquare } from 'lucide-react';
import { logout } from '@/services/authService';
import toast from 'react-hot-toast';
import { User } from '@/types';

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
      router.refresh();
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <Link href="/dashboard" className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
        <CheckSquare size={22} />
        TaskFlow
      </Link>

      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:block">
            Hi, <span className="font-medium text-gray-800">{user.name}</span>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
