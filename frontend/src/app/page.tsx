'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Zap, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 w-full z-50 glass-card rounded-none border-x-0 border-t-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl">Novawealth</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#plans" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">
              Plans
            </Link>
            <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">
              Login
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              Invest Smart,<br />Earn Daily
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join a premium investment platform built for smart growth with glassmorphism visuals, instant wallet tracking, and daily profit automation.
              Start with as little as ₦2,000 and watch your wealth grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Investing <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: 'Daily Returns', desc: 'Earn profits every 24 hours automatically credited to your wallet.' },
            { icon: Shield, title: 'Secure Platform', desc: 'Bank-grade security with encrypted transactions and protected accounts.' },
            { icon: Users, title: 'Referral Rewards', desc: 'Earn bonuses when you refer friends to join Novawealth.' },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-card-hover p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="plans" className="py-20 px-6">
        <div className="max-w-7xl mx-auto rounded-[2rem] border border-white/40 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/70 md:p-12">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">Investment Plans</p>
            <h2 className="text-3xl font-bold mt-3">Flexible plans for every growth goal</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
              Pick a plan that fits your budget and start earning daily returns instantly.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { tier: 'Tier 1', amount: '₦2,000', profit: '₦300/day', duration: '30 Days', color: 'from-blue-500 to-cyan-500' },
              { tier: 'Tier 2', amount: '₦4,000', profit: '₦400/day', duration: '30 Days', color: 'from-purple-500 to-pink-500', popular: true },
              { tier: 'Tier 3', amount: '₦6,000', profit: '₦600/day', duration: '30 Days', color: 'from-orange-500 to-red-500' },
            ].map((plan, i) => (
              <motion.div
                key={plan.tier}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`min-h-[280px] rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-lg backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-800/90 relative ${plan.popular ? 'ring-2 ring-accent-500' : ''}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-500 text-white text-sm rounded-full">
                    Popular
                  </span>
                )}
                <div className={`w-full h-2 rounded-full bg-gradient-to-r ${plan.color} mb-6`} />
                <h3 className="text-2xl font-bold mb-4">{plan.tier}</h3>
                <p className="text-4xl font-bold mb-2">{plan.amount}</p>
                <p className="text-green-500 font-medium mb-1">{plan.profit}</p>
                <p className="text-gray-500 mb-6">{plan.duration}</p>
                <Link href="/register">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>&copy; 2026 Novawealth. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
