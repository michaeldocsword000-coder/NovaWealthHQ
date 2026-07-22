'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TopBar } from '@/components/layout/Sidebar';
import { GlassCard, PageLoader } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import { Building2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export default function DepositPage() {
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ amount: '', senderName: '', reference: '' });
  const [screenshot, setScreenshot] = useState<File | null>(null);

  useEffect(() => {
    api.get<{ success: boolean; data: BankDetails }>('/deposits/bank-details')
      .then((res) => setBankDetails(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('amount', form.amount);
      formData.append('senderName', form.senderName);
      if (form.reference) formData.append('reference', form.reference);
      if (screenshot) formData.append('screenshot', screenshot);

      await api.post('/deposits', formData, true);
      toast.success('Deposit submitted! Awaiting admin approval.');
      setForm({ amount: '', senderName: '', reference: '' });
      setScreenshot(null);
      setShowForm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit deposit');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <PageLoader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <TopBar title="Add Funds" />

      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <GlassCard className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Bank Transfer Details</h3>
              <p className="text-sm text-gray-500">Transfer to the account below</p>
            </div>
          </div>

          {bankDetails && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Bank Name</p>
                    <p className="font-bold">{bankDetails.bankName}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Account Number</p>
                    <p className="font-bold text-lg">{bankDetails.accountNumber}</p>
                  </div>
                  <CopyButton text={bankDetails.accountNumber} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Account Name</p>
                  <p className="font-bold">{bankDetails.accountName}</p>
                </div>
              </div>

              {!showForm ? (
                <Button onClick={() => setShowForm(true)} className="w-full">
                  I Have Paid
                </Button>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 mt-6 pt-6 border-t border-white/10">
                  <Input
                    label="Amount (₦)"
                    type="number"
                    placeholder="Enter amount transferred"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                    min={100}
                  />
                  <Input
                    label="Sender Name"
                    placeholder="Name on the transfer"
                    value={form.senderName}
                    onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                    required
                  />
                  <Input
                    label="Transaction Reference (optional)"
                    placeholder="Bank reference number"
                    value={form.reference}
                    onChange={(e) => setForm({ ...form, reference: e.target.value })}
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Screenshot (optional)
                    </label>
                    <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary-500/50 transition-all">
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {screenshot ? screenshot.name : 'Upload payment screenshot'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" loading={submitting} className="flex-1">
                      Submit Deposit
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
