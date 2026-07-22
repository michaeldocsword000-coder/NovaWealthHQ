'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TopBar } from '@/components/layout/Sidebar';
import { StatCard, GlassCard, PageLoader } from '@/components/ui/GlassCard';
import { formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import { Users, ArrowDownToLine, ArrowUpFromLine, TrendingUp, Clock, DollarSign } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AdminStats {
  totalUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalInvestments: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  revenue: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ success: boolean; data: AdminStats }>('/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <PageLoader />
      </DashboardLayout>
    );
  }

  if (!stats) return null;

  const chartData = [
    { name: 'Deposits', value: stats.totalDeposits },
    { name: 'Withdrawals', value: stats.totalWithdrawals },
    { name: 'Revenue', value: stats.revenue },
  ];

  return (
    <DashboardLayout>
      <TopBar title="Admin Dashboard" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={String(stats.totalUsers)} icon={<Users className="w-6 h-6 text-white" />} color="from-blue-500 to-cyan-500" />
          <StatCard title="Total Deposits" value={formatCurrency(stats.totalDeposits)} icon={<ArrowDownToLine className="w-6 h-6 text-white" />} color="from-green-500 to-emerald-500" />
          <StatCard title="Total Withdrawals" value={formatCurrency(stats.totalWithdrawals)} icon={<ArrowUpFromLine className="w-6 h-6 text-white" />} color="from-red-500 to-orange-500" />
          <StatCard title="Total Investments" value={String(stats.totalInvestments)} icon={<TrendingUp className="w-6 h-6 text-white" />} color="from-purple-500 to-pink-500" />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard title="Pending Deposits" value={String(stats.pendingDeposits)} icon={<Clock className="w-6 h-6 text-white" />} color="from-yellow-500 to-orange-500" />
          <StatCard title="Pending Withdrawals" value={String(stats.pendingWithdrawals)} icon={<Clock className="w-6 h-6 text-white" />} color="from-yellow-500 to-orange-500" />
          <StatCard title="Revenue" value={formatCurrency(stats.revenue)} icon={<DollarSign className="w-6 h-6 text-white" />} color="from-primary-500 to-accent-500" />
        </div>

        <GlassCard className="p-6">
          <h3 className="text-lg font-bold mb-4">Financial Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
