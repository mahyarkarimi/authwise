'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/Button';
import Card from '@/components/Card';
import axiosInstance from '@/lib/axios';
import { useAuth } from '@/components/AuthContext';

export default function Authorize() {
  const auth = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const getCode = async () => {
    const url = new URL('http://localhost:3000/api/auth/authorize');
    url.search = searchParams.toString();
    window.location.href = url.href;
  }

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // In real OAuth, parse query params for client_id, scope, etc.
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Authorize Application</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            The application is requesting access to your data.
          </p>
        </div>
        <div className="space-y-4">
          <Button variant="primary" size="lg" className='w-full' onClick={getCode}>
            Allow
          </Button>
          <Button variant="secondary" size="lg" className="w-full">
            Deny
          </Button>
        </div>
      </Card>
    </div>
  );
}