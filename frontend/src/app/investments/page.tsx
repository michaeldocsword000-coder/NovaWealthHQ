'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TopBar } from '@/components/layout/Sidebar';
import { GlassCard, PageLoader } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { TrendingUp, Check, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

interface Plan {
  id: string;
  name: string;
  tier: number;
  amount: number;
  dailyProfit: number;
  duration: number;
}

const tierColors = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-orange-500 to-red-500',
];

export default function InvestmentsPage() {
  const { user, refreshUser } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    api.get<{ success: boolean; plans: Plan[] }>('/investments/plans')
      .then((res) => setPlans(res.plans))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePurchase = async (planId: string) => {
    setPurchasing(planId);
    try {
      await api.post('/investments/purchase', { planId });
      toast.success('Investment plan activated!');
      await refreshUser();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to purchase plan');
    } finally {
      setPurchasing(null);
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
      <TopBar title="Investment Plans" />

      <div className="p-6">
        <GlassCard className="p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Available Balance</p>
            <p className="text-2xl font-bold">{formatCurrency(user?.balance || 0)}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-primary-500" />
        </GlassCard>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <GlassCard key={plan.id} hover delay={i * 0.1} className="p-8 relative">
              {plan.tier === 2 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-500 text-white text-sm rounded-full">
                  Popular
                </span>
              )}
              <div className={`w-full h-2 rounded-full bg-gradient-to-r ${tierColors[i]} mb-6`} />
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className="text-3xl font-bold mb-4">{formatCurrency(plan.amount)}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-green-500">
                  <Zap className="w-4 h-4" />
                  <span className="font-medium">{formatCurrency(plan.dailyProfit)}/day</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Check className="w-4 h-4" />
                  <span>{plan.duration} days duration</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Check className="w-4 h-4" />
                  <span>Total return: {formatCurrency(plan.dailyProfit * plan.duration)}</span>
                </div>
              </div>

              <Button
                onClick={() => handlePurchase(plan.id)}
                loading={purchasing === plan.id}
                disabled={(user?.balance || 0) < plan.amount}
                className="w-full"
              >
                {(user?.balance || 0) < plan.amount ? 'Insufficient Balance' : 'Activate Plan'}
              </Button>
            </GlassCard>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
