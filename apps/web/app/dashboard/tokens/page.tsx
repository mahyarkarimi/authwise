'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import Button from '@/components/Button';
import TableWithPagination from '@/components/TableWithPagination';
import PopConfirm from '@/components/PopConfirm';

interface Token {
  id: string;
  accessToken: string;
  refreshToken?: string;
  clientId: string;
  client: { id: string; name: string };
  accessTokenExpiresAt?: string;
  refreshTokenExpiresAt?: string;
  scope: string[];
  createdAt: string;
  isCurrentSession: boolean;
}

export default function Tokens() {
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();

  const fetchTokens = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await axiosInstance.get('/auth/list-tokens');
      setTokens(response.data.tokens || []);
      setError('');
      setCurrentPage(1); // Reset to first page on refresh
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/login');
      } else {
        setError('Failed to load tokens');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  const revokeToken = useCallback(async (token: string) => {
    try {
      await axiosInstance.delete(`/auth/tokens/${token}`);
      setTokens(tokens.filter(t => t.accessToken !== token && t.refreshToken !== token));
      setError('');
      // Adjust current page if necessary
      const totalPages = Math.ceil((tokens.length - 1) / pageSize);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    } catch (err: any) {
      setError('Failed to revoke token');
    }
  }, [tokens, currentPage, pageSize]);


  const columns = [
    {
      key: 'client',
      label: 'Client',
      render: (_: any, token: Token) => (
        <div>
          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {token.client?.name ?? 'Unknown Client'}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{token.client.name}</div>
        </div>
      ),
    },
    {
      key: 'scope',
      label: 'Scope',
      render: (_: any, token: Token) => (
        <div className="text-sm text-slate-900 dark:text-slate-100">
          {token.scope.length > 0 ? token.scope.join(', ') : 'No scope'}
        </div>
      ),
    },
    {
      key: 'accessTokenExpiresAt',
      label: 'Expires',
      render: (_: any, token: Token) => (
        <div className="text-sm text-slate-900 dark:text-slate-100">
          {token.accessTokenExpiresAt
            ? new Date(token.accessTokenExpiresAt).toLocaleString()
            : 'No expiration'
          }
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (_: any, token: Token) => (
        <div className="text-sm text-slate-900 dark:text-slate-100">
          {new Date(token.createdAt).toLocaleString()}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, token: Token) => (
        <PopConfirm 
          title="Warning" 
          message="Are you sure you want to revoke this token?"
          disabled={token.isCurrentSession} 
          onConfirm={() => revokeToken(token.refreshToken || token.accessToken)}>
          <Button
            variant="danger"
            size="sm"
            disabled={token.isCurrentSession}
          >
            Revoke
          </Button>
          {token.isCurrentSession && (
            <div className="text-xs text-red-600 dark:text-red-400 mt-1">
              (Cannot revoke current session)
            </div>
          )}
        </PopConfirm>
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Active Access Tokens</h1>
        <Button
          onClick={fetchTokens}
          loading={refreshing}
          variant="outline"
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <TableWithPagination
        data={tokens}
        columns={columns}
        loading={false}
        emptyMessage="No active tokens found"
        pagination={{
          currentPage,
          pageSize,
          total: tokens.length,
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize,
        }}
      />
    </div>
  );
}