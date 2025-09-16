'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import adminAxios from '@/lib/adminAxios';
import Button from '@/components/Button';
import TableWithPagination from '@/components/TableWithPagination';
import { toast } from 'react-toastify';
import PopConfirm from '@/components/PopConfirm';
import Link from 'next/link';

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  isActive: boolean;
}

export default function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminAxios.get('/admin/users');
      setUsers(response.data.users || []);
      setCurrentPage(1);
    } catch (err: any) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    try {
      await adminAxios.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
      fetchUsers();
    } catch (err: any) {
      toast.error('Failed to delete user');
    }
  }, [users, currentPage, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns = [
    {
      key: 'username',
      label: 'Username',
      render: (_: any, user: User) => (
        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.username}</div>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (_: any, user: User) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isActive
          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (_: any, user: User) => (
        <div className="text-sm text-slate-900 dark:text-slate-100">{new Date(user.createdAt).toLocaleDateString()}</div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, user: User) => (
        <div className="flex space-x-2">
          <PopConfirm title="Warning" message="Are you sure?" onConfirm={() => deleteUser(user.id)}>
            <Button variant="danger" size="sm">
              Delete
            </Button>
          </PopConfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">User Management</h1>
        <Link href="/admin/dashboard/users/new">
          <Button variant="primary" size="md">
            Add New User
          </Button>
        </Link>
      </div>

      <TableWithPagination
        data={users}
        columns={columns}
        loading={loading}
        emptyMessage="No users found"
        pagination={{
          currentPage,
          pageSize,
          total: users.length,
          onPageChange: setCurrentPage,
          onPageSizeChange: setPageSize,
        }}
      />
    </div>
  );
}