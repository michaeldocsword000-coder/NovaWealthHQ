'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TopBar } from '@/components/layout/Sidebar';
import { GlassCard, PageLoader, StatCard } from '@/components/ui/GlassCard';
import { CopyButton } from '@/components/ui/CopyButton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { api } from '@/lib/api';
import { Users, Gift, Link2 } from 'lucide-react';

interface ReferralData {
  referralCode: string;
  referralBonus: number;
  totalReferrals: number;
  referralLink: string;
  referrals: Array<{
    id: string;
    bonus: number;
    createdAt: string;
    referred: { username: string; email: string; createdAt: string };
  }>;
}

export default function ReferralsPage() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ success: boolean; data: ReferralData }>('/user/referrals')
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

  return (
    <DashboardLayout>
      <TopBar title="Referrals" />

      <div className="p-6 space-y-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Referrals"
            value={String(data.totalReferrals)}
            icon={<Users className="w-6 h-6 text-white" />}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            title="Referral Bonus"
            value={formatCurrency(data.referralBonus)}
            icon={<Gift className="w-6 h-6 text-white" />}
            color="from-purple-500 to-pink-500"
          />
          <StatCard
            title="Referral Code"
            value={data.referralCode}
            icon={<Link2 className="w-6 h-6 text-white" />}
            color="from-green-500 to-emerald-500"
          />
        </div>

        <GlassCard className="p-6">
          <h3 className="text-lg font-bold mb-4">Your Referral Link</h3>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
            <p className="flex-1 text-sm break-all">{data.referralLink}</p>
            <CopyButton text={data.referralLink} label="Copy Link" />
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Share this link with friends. When they register, you earn a referral bonus!
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-bold mb-4">Referral History</h3>
          {data.referrals.length ? (
            <div className="space-y-3">
              {data.referrals.map((ref) => (
                <div key={ref.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <div>
                    <p className="font-medium">{ref.referred.username}</p>
                    <p className="text-sm text-gray-500">{formatDate(ref.createdAt)}</p>
                  </div>
                  <p className="font-bold text-green-500">+{formatCurrency(ref.bonus)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No referrals yet. Share your link to get started!</p>
          )}
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
