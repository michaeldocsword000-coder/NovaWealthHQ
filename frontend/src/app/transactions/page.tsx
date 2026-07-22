'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TopBar } from '@/components/layout/Sidebar';
import { GlassCard, PageLoader } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Button';
import { formatCurrency, formatDate, getTransactionColor, getStatusColor, cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { Search, Download } from 'lucide-react';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchTransactions = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (typeFilter) params.set('type', typeFilter);
    params.set('limit', '50');

    api.get<{ success: boolean; transactions: Transaction[] }>(`/transactions?${params}`)
      .then((res) => setTransactions(res.transactions))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTransactions();
  }, [typeFilter]);

  const handleExport = async () => {
    const token = document.cookie.match(/token=([^;]+)/)?.[1];
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/export`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
  };

  return (
    <DashboardLayout>
      <TopBar title="Transaction History" />

      <div className="p-6 space-y-6">
        <GlassCard className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11"
                onKeyDown={(e) => e.key === 'Enter' && fetchTransactions()}
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field w-full sm:w-48"
            >
              <option value="">All Types</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAWAL">Withdrawal</option>
              <option value="INVESTMENT">Investment</option>
              <option value="DAILY_PROFIT">Daily Profit</option>
              <option value="REFERRAL_BONUS">Referral Bonus</option>
            </select>
            <Button variant="secondary" onClick={handleExport}>
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          {loading ? (
            <PageLoader />
          ) : (
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
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
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
                  {!transactions.length && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">No transactions found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
