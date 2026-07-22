'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Bell,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { useState } from 'react';

const userLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/deposit', label: 'Add Funds', icon: Wallet },
  { href: '/investments', label: 'Investments', icon: TrendingUp },
  { href: '/withdraw', label: 'Withdraw', icon: ArrowUpFromLine },
  { href: '/referrals', label: 'Referrals', icon: Users },
  { href: '/transactions', label: 'Transactions', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const adminLinks = [
  { href: '/admin', label: 'Admin Dashboard', icon: Shield },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/deposits', label: 'Deposits', icon: ArrowDownToLine },
  { href: '/admin/withdrawals', label: 'Withdrawals', icon: ArrowUpFromLine },
  { href: '/admin/plans', label: 'Plans', icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = user?.role === 'ADMIN' ? [...userLinks, ...adminLinks] : userLinks;

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Novawealth</h1>
            <p className="text-xs text-gray-500">Investment Platform</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(isActive ? 'sidebar-link-active' : 'sidebar-link')}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <button onClick={toggleTheme} className="sidebar-link w-full">
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button onClick={logout} className="sidebar-link w-full text-red-500">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass-card"
      >
        <Menu className="w-6 h-6" />
      </button>

      <aside className="hidden lg:flex flex-col w-64 min-h-screen glass-card rounded-none border-y-0 border-l-0">
        <NavContent />
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 glass-card flex flex-col animate-slide-up">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1"
            >
              <X className="w-6 h-6" />
            </button>
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}

export function TopBar({ title, notificationCount = 0 }: { title: string; notificationCount?: number }) {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between p-6 lg:pl-6 pl-16">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-sm text-gray-500">Welcome back, {user?.username}</p>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="relative p-2 rounded-xl glass-card hover:bg-white/20 transition-all">
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </Link>
        <div className="flex items-center gap-3 glass-card px-4 py-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              user?.username?.charAt(0).toUpperCase()
            )}
          </div>
          <div className="hidden sm:block">
            <p className="font-medium text-sm">{user?.username}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
