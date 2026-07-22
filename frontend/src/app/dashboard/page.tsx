'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TopBar } from '@/components/layout/Sidebar';
import { StatCard, GlassCard, PageLoader } from '@/components/ui/GlassCard';
import { formatCurrency, formatDate, getTransactionColor, getStatusColor, cn } from '@/lib/utils';
import { api } from '@/lib/api';
import {
  Wallet,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  Bell,
  Activity,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DashboardData {
  user: {
    username: string;
    balance: number;
    referralBonus: number;
    profilePicture?: string;
  };
  activeInvestment: {
    plan: { name: string };
    dailyProfit: number;
    daysCompleted: number;
    duration: number;
    totalEarned: number;
    amount: number;
  } | null;
  hasActivePlan: boolean;
  totalEarnings: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalReferrals: number;
  unreadNotifications: number;
  recentTransactions: Array<{
    id: string;
    type: string;
    amount: number;
    status: string;
    description: string;
    createdAt: string;
  }>;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ success: boolean; data: DashboardData }>('/user/dashboard')
      .then((res) => setData(res.data))
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

  if (!data) return null;

  const chartData = data.recentTransactions.slice(0, 7).reverse().map((t, i) => ({
    name: `Day ${i + 1}`,
    amount: t.amount,
  }));

  return (
    <DashboardLayout>
      <TopBar title="Dashboard" notificationCount={data.unreadNotifications} />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Wallet Balance"
            value={formatCurrency(data.user.balance)}
            icon={<Wallet className="w-6 h-6 text-white" />}
            color="from-blue-500 to-cyan-500"
            delay={0}
          />
          <StatCard
            title="Total Earnings"
            value={formatCurrency(data.totalEarnings)}
            icon={<TrendingUp className="w-6 h-6 text-white" />}
            color="from-green-500 to-emerald-500"
            delay={0.1}
          />
          <StatCard
            title="Total Deposits"
            value={formatCurrency(data.totalDeposits)}
            icon={<ArrowDownToLine className="w-6 h-6 text-white" />}
            color="from-purple-500 to-pink-500"
            delay={0.2}
          />
          <StatCard
            title="Total Withdrawals"
            value={formatCurrency(data.totalWithdrawals)}
            icon={<ArrowUpFromLine className="w-6 h-6 text-white" />}
            color="from-orange-500 to-red-500"
            delay={0.3}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <GlassCard className="lg:col-span-2 p-6" delay={0.4}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-500" />
              Earnings Overview
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData.length ? chartData : [{ name: 'No data', amount: 0 }]}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" fill="url(#colorAmount)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard className="p-6" delay={0.5}>
            <h3 className="text-lg font-bold mb-4">Active Investment Plan</h3>
            {data.hasActivePlan && data.activeInvestment ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary-500/20 to-accent-500/20">
                  <p className="text-sm text-gray-500">Plan</p>
                  <p className="text-xl font-bold">{data.activeInvestment.plan.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Daily Profit</p>
                    <p className="font-bold text-green-500">{formatCurrency(data.activeInvestment.dailyProfit)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Earned</p>
                    <p className="font-bold">{formatCurrency(data.activeInvestment.totalEarned)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Progress</p>
                    <p className="font-bold">{data.activeInvestment.daysCompleted}/{data.activeInvestment.duration} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Invested</p>
                    <p className="font-bold">{formatCurrency(data.activeInvestment.amount)}</p>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all"
                    style={{ width: `${(data.activeInvestment.daysCompleted / data.activeInvestment.duration) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 font-medium">No Active Plan</p>
                <p className="text-sm text-gray-400 mt-1">Fund your wallet, get your deposit approved, and activate a tier to start earning daily profits.</p>
              </div>
            )}
          </GlassCard>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <GlassCard className="p-6" delay={0.6}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-accent-500" />
                Referral Earnings
              </h3>
              <span className="text-sm text-gray-500">{data.totalReferrals} referrals</span>
            </div>
            <p className="text-3xl font-bold text-accent-500">{formatCurrency(data.user.referralBonus)}</p>
          </GlassCard>

          <GlassCard className="p-6" delay={0.7}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-500" />
              Recent Notifications
            </h3>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {data.notifications.length ? data.notifications.slice(0, 5).map((n) => (
                <div key={n.id} className={cn('p-3 rounded-lg', n.isRead ? 'bg-white/5' : 'bg-primary-500/10')}>
                  <p className="font-medium text-sm">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                </div>
              )) : (
                <p className="text-gray-500 text-sm">No notifications yet</p>
              )}
            </div>
          </GlassCard>
        </div>

        <GlassCard className="p-6" delay={0.8}>
          <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-white/10">
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Type</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Description</th>
                </tr>
              </thead>
              <tbody>
                {data.recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/5">
                    <td className="py-3 pr-4 text-sm">{formatDate(tx.createdAt)}</td>
                    <td className={cn('py-3 pr-4 text-sm font-medium', getTransactionColor(tx.type))}>
                      {tx.type.replace('_', ' ')}
                    </td>
                    <td className="py-3 pr-4 text-sm font-bold">{formatCurrency(tx.amount)}</td>
                    <td className="py-3 pr-4">
                      <span className={cn('px-2 py-1 rounded-full text-xs', getStatusColor(tx.status))}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-500">{tx.description}</td>
                  </tr>
                ))}
                {!data.recentTransactions.length && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">No transactions yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
