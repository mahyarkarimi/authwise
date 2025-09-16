'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import Button from '@/components/Button';
import TableWithPagination from '@/components/TableWithPagination';
import PopConfirm from '@/components/PopConfirm';

interface AuthorizationCode {
  id: string;
  code: string;
  clientId: string;
  client: {
    id: string;
    name: string;
  };
  scope: string[];
  createdAt: string;
}

export default function AuthorizedApplications() {
  const [loading, setLoading] = useState(true);
  const [authCodes, setAuthCodes] = useState<AuthorizationCode[]>([]);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();

  const fetchClients = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await axiosInstance.get('/auth/list-authorization-codes');
      setAuthCodes(response.data.codes || []);
      setError('');
      setCurrentPage(1);
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/login');
      } else {
        setError('Failed to load authorization codes');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  const revokeAuthCode = useCallback(async (code: string) => {
    try {
      await axiosInstance.delete(`/auth/authorization-codes/${code}`);
      setAuthCodes(authCodes.filter(t => t.code !== code));
      setError('');
      // Adjust current page if necessary
      const totalPages = Math.ceil((authCodes.length - 1) / pageSize);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    } catch (err: any) {
      setError('Failed to revoke access');
    }
  }, [authCodes, currentPage, pageSize]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const columns = [
    {
      key: 'clientId',
      label: 'Client ID',
      render: (_: any, code: AuthorizationCode) => (
        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{code.clientId}</div>
      ),
    },
    {
      key: 'clientName',
      label: 'Client Name',
      render: (_: any, code: AuthorizationCode) => (
        <div className="text-sm text-slate-900 dark:text-slate-100">{code.client.name || 'N/A'}</div>
      ),
    },
    {
      key: 'scope',
      label: 'Scope',
      render: (_: any, code: AuthorizationCode) => (
        <div className="text-sm text-slate-900 dark:text-slate-100">{code.scope.join(', ')}</div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (_: any, client: AuthorizationCode) => (
        <div className="text-sm text-slate-900 dark:text-slate-100">{new Date(client.createdAt).toLocaleDateString()}</div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, client: AuthorizationCode) => (
        <div className="flex space-x-2">
          <PopConfirm title="Warning" message="Are you sure you want to revoke this authorization code?" onConfirm={() => revokeAuthCode(client.id)}>
            <Button variant="danger" size="sm">
              Revoke
            </Button>
          </PopConfirm>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">My Authorized Applications</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <TableWithPagination
        data={authCodes}
        columns={columns}
        loading={false}
        emptyMessage="No application found"
        pagination={{
          currentPage,
          pageSize,
          total: authCodes.length,
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize,
        }}
      />
    </div>
  );
}