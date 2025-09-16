'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import Card from '@/components/Card';

export default function Profile() {
  const auth = useAuth();

  useEffect(() => {
    auth.refetch();
  }, []);

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Profile</h1>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">User Information</h2>
        {auth.user ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {auth.user.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-medium text-slate-900 dark:text-slate-100">{auth.user.username}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Member since {new Date(auth.user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Username</p>
                <p className="text-lg text-slate-900 dark:text-slate-100">{auth.user.username}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Account Created</p>
                <p className="text-lg text-slate-900 dark:text-slate-100">{new Date(auth.user.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-600 dark:text-slate-400">No user data available</p>
        )}
      </Card>
    </div>
  );
}
