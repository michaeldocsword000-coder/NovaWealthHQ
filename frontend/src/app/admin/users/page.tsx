'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TopBar } from '@/components/layout/Sidebar';
import { GlassCard, PageLoader } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Button';
import { formatCurrency, formatDate, getStatusColor, cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  balance: number;
  status: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    const params = search ? `?search=${search}` : '';
    api.get<{ success: boolean; users: User[] }>(`/admin/users${params}`)
      .then((res) => setUsers(res.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSuspend = async (id: string, status: string) => {
    try {
      await api.put(`/admin/users/${id}`, { status: status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' });
      toast.success(`User ${status === 'ACTIVE' ? 'suspended' : 'activated'}`);
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Action failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <DashboardLayout>
      <TopBar title="Manage Users" />

      <div className="p-6 space-y-6">
        <GlassCard className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-11" onKeyDown={(e) => e.key === 'Enter' && fetchUsers()} />
            </div>
            <Button onClick={fetchUsers}>Search</Button>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          {loading ? <PageLoader /> : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-white/10">
                    <th className="pb-3 pr-4">User</th>
                    <th className="pb-3 pr-4">Balance</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4">Joined</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5">
                      <td className="py-3 pr-4">
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </td>
                      <td className="py-3 pr-4 font-bold">{formatCurrency(user.balance)}</td>
                      <td className="py-3 pr-4">
                        <span className={cn('px-2 py-1 rounded-full text-xs', getStatusColor(user.status))}>{user.status}</span>
                      </td>
                      <td className="py-3 pr-4 text-sm">{formatDate(user.createdAt)}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" onClick={() => handleSuspend(user.id, user.status)}>
                            {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => handleDelete(user.id)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
