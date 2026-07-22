'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TopBar } from '@/components/layout/Sidebar';
import { GlassCard, PageLoader } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface Withdrawal {
  id: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: string;
  createdAt: string;
  user: { username: string; email: string; balance: number };
}

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = () => {
    api.get<{ success: boolean; withdrawals: Withdrawal[] }>('/admin/withdrawals?status=PENDING')
      .then((res) => setWithdrawals(res.withdrawals))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchWithdrawals(); }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.put(`/admin/withdrawals/${id}/approve`);
      toast.success('Withdrawal approved');
      fetchWithdrawals();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    }
  };

  const handleReject = async (id: string) => {
    const note = prompt('Rejection reason (optional):');
    try {
      await api.put(`/admin/withdrawals/${id}/reject`, { adminNote: note });
      toast.success('Withdrawal rejected');
      fetchWithdrawals();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    }
  };

  const handlePaid = async (id: string) => {
    try {
      await api.put(`/admin/withdrawals/${id}/paid`);
      toast.success('Marked as paid');
      fetchWithdrawals();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    }
  };

  return (
    <DashboardLayout>
      <TopBar title="Pending Withdrawals" />

      <div className="p-6">
        <GlassCard className="p-6">
          {loading ? <PageLoader /> : withdrawals.length ? (
            <div className="space-y-4">
              {withdrawals.map((w) => (
                <div key={w.id} className="p-4 rounded-xl bg-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-lg">{formatCurrency(w.amount)}</p>
                    <p className="text-sm text-gray-500">{w.user.username} (Balance: {formatCurrency(w.user.balance)})</p>
                    <p className="text-sm">{w.bankName} - {w.accountNumber}</p>
                    <p className="text-sm text-gray-500">{w.accountName}</p>
                    <p className="text-xs text-gray-400">{formatDate(w.createdAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApprove(w.id)}>Approve</Button>
                    <Button size="sm" variant="secondary" onClick={() => handlePaid(w.id)}>Mark Paid</Button>
                    <Button size="sm" variant="danger" onClick={() => handleReject(w.id)}>Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No pending withdrawals</p>
          )}
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
