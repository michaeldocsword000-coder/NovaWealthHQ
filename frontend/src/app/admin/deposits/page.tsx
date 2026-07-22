'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TopBar } from '@/components/layout/Sidebar';
import { GlassCard, PageLoader } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface Deposit {
  id: string;
  amount: number;
  senderName: string;
  reference?: string;
  screenshot?: string;
  status: string;
  createdAt: string;
  user: { username: string; email: string };
}

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeposits = () => {
    api.get<{ success: boolean; deposits: Deposit[] }>('/admin/deposits?status=PENDING')
      .then((res) => setDeposits(res.deposits))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDeposits(); }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.put(`/admin/deposits/${id}/approve`);
      toast.success('Deposit approved');
      fetchDeposits();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    }
  };

  const handleReject = async (id: string) => {
    const note = prompt('Rejection reason (optional):');
    try {
      await api.put(`/admin/deposits/${id}/reject`, { adminNote: note });
      toast.success('Deposit rejected');
      fetchDeposits();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    }
  };

  return (
    <DashboardLayout>
      <TopBar title="Pending Deposits" />

      <div className="p-6">
        <GlassCard className="p-6">
          {loading ? <PageLoader /> : deposits.length ? (
            <div className="space-y-4">
              {deposits.map((d) => (
                <div key={d.id} className="p-4 rounded-xl bg-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-lg">{formatCurrency(d.amount)}</p>
                    <p className="text-sm text-gray-500">From: {d.senderName} ({d.user.username})</p>
                    <p className="text-sm text-gray-500">{formatDate(d.createdAt)}</p>
                    {d.reference && <p className="text-sm">Ref: {d.reference}</p>}
                    {d.screenshot && (
                      <a href={`http://localhost:5000${d.screenshot}`} target="_blank" rel="noopener" className="text-sm text-primary-500 hover:underline">
                        View Screenshot
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApprove(d.id)}>Approve</Button>
                    <Button size="sm" variant="danger" onClick={() => handleReject(d.id)}>Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No pending deposits</p>
          )}
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
