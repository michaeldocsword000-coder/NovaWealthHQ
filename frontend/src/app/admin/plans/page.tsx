'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TopBar } from '@/components/layout/Sidebar';
import { GlassCard, PageLoader } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface Plan {
  id: string;
  name: string;
  tier: number;
  amount: number;
  dailyProfit: number;
  duration: number;
  isActive: boolean;
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Plan>>({});

  const fetchPlans = () => {
    api.get<{ success: boolean; plans: Plan[] }>('/admin/plans')
      .then((res) => setPlans(res.plans))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleSave = async (id: string) => {
    try {
      await api.put(`/admin/plans/${id}`, editForm);
      toast.success('Plan updated');
      setEditing(null);
      fetchPlans();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    }
  };

  return (
    <DashboardLayout>
      <TopBar title="Investment Plans" />

      <div className="p-6">
        {loading ? <PageLoader /> : (
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <GlassCard key={plan.id} className="p-6">
                <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
                {editing === plan.id ? (
                  <div className="space-y-3">
                    <Input label="Amount" type="number" value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })} />
                    <Input label="Daily Profit" type="number" value={editForm.dailyProfit} onChange={(e) => setEditForm({ ...editForm, dailyProfit: parseFloat(e.target.value) })} />
                    <Input label="Duration (days)" type="number" value={editForm.duration} onChange={(e) => setEditForm({ ...editForm, duration: parseInt(e.target.value) })} />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSave(plan.id)}>Save</Button>
                      <Button size="sm" variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p>Amount: <span className="font-bold">{formatCurrency(plan.amount)}</span></p>
                    <p>Daily Profit: <span className="font-bold text-green-500">{formatCurrency(plan.dailyProfit)}</span></p>
                    <p>Duration: <span className="font-bold">{plan.duration} days</span></p>
                    <p>Status: <span className={plan.isActive ? 'text-green-500' : 'text-red-500'}>{plan.isActive ? 'Active' : 'Inactive'}</span></p>
                    <Button size="sm" variant="secondary" className="mt-4" onClick={() => { setEditing(plan.id); setEditForm(plan); }}>
                      Edit Plan
                    </Button>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
