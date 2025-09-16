'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import adminAxios from '@/lib/adminAxios';
import Button from '@/components/Button';
import TableWithPagination from '@/components/TableWithPagination';
import { toast } from 'react-toastify';
import Link from 'next/link';

interface Client {
  id: string;
  clientId: string;
  name?: string;
  redirectUris: string[];
  grants: string[];
  scope: string[];
  createdAt: string;
}

export default function AdminClients() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();

  const fetchClients = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await adminAxios.get('/admin/clients');
      if (response.status >= 200 && response.status < 300) {
        setClients(response.data.clients || []);
        setCurrentPage(1);
      } else {
        toast.error('Failed to load clients');
      }
    } catch (err: any) {
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const columns = [
    {
      key: 'clientId',
      label: 'Client ID',
      render: (_: any, client: Client) => (
        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{client.clientId}</div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (_: any, client: Client) => (
        <div className="text-sm text-slate-900 dark:text-slate-100">{client.name || 'N/A'}</div>
      ),
    },
    {
      key: 'redirectUris',
      label: 'Redirect URIs',
      render: (_: any, client: Client) => (
        <div className="text-sm text-slate-900 dark:text-slate-100">
          {client.redirectUris.map((uri, index) => (
            <div key={index}>{uri}</div>
          ))}
        </div>
      ),
    },
    {
      key: 'grants',
      label: 'Grants',
      render: (_: any, client: Client) => (
        <div className="text-sm text-slate-900 dark:text-slate-100">{client.grants.join(', ')}</div>
      ),
    },
    {
      key: 'scope',
      label: 'Scope',
      render: (_: any, client: Client) => (
        <div className="text-sm text-slate-900 dark:text-slate-100">{client.scope.join(', ')}</div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (_: any, client: Client) => (
        <div className="text-sm text-slate-900 dark:text-slate-100">{new Date(client.createdAt).toLocaleDateString()}</div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, client: Client) => (
        <div className="flex space-x-2">
          <Link href={`/admin/dashboard/clients/${client.id}`}>
            <Button variant="secondary" size="sm">
              Edit
            </Button>
          </Link>
          <Button variant="danger" size="sm">
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Client Management</h1>
        <Link href="/admin/dashboard/clients/new">
          <Button variant="primary" size="md">
            Add New Client
          </Button>
        </Link>
      </div>

      <TableWithPagination
        data={clients}
        columns={columns}
        loading={loading}
        emptyMessage="No clients found"
        pagination={{
          currentPage,
          pageSize,
          total: clients.length,
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize,
        }}
      />
    </div>
  );
}