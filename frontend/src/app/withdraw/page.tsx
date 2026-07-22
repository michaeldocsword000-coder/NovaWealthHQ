'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TopBar } from '@/components/layout/Sidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { ArrowUpFromLine } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WithdrawPage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    amount: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/withdrawals', form);
      toast.success('Withdrawal request submitted!');
      setForm({ amount: '', bankName: '', accountNumber: '', accountName: '' });
      await refreshUser();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit withdrawal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <TopBar title="Withdraw Funds" />

      <div className="p-6 max-w-2xl mx-auto">
        <GlassCard className="p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Available Balance</p>
            <p className="text-2xl font-bold">{formatCurrency(user?.balance || 0)}</p>
          </div>
          <ArrowUpFromLine className="w-8 h-8 text-primary-500" />
        </GlassCard>

        <GlassCard className="p-8">
          <h3 className="text-xl font-bold mb-6">Withdrawal Request</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Amount (₦)"
              type="number"
              placeholder="Enter withdrawal amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
              min={500}
            />
            <Input
              label="Bank Name"
              placeholder="e.g. Access Bank"
              value={form.bankName}
              onChange={(e) => setForm({ ...form, bankName: e.target.value })}
              required
            />
            <Input
              label="Account Number"
              placeholder="10-digit account number"
              value={form.accountNumber}
              onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
              required
            />
            <Input
              label="Account Name"
              placeholder="Name on bank account"
              value={form.accountName}
              onChange={(e) => setForm({ ...form, accountName: e.target.value })}
              required
            />
            <Button type="submit" loading={loading} className="w-full">
              Submit Withdrawal
            </Button>
          </form>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
