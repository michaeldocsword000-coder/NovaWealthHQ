import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getTransactionColor(type: string): string {
  switch (type) {
    case 'DEPOSIT':
      return 'text-blue-500';
    case 'WITHDRAWAL':
      return 'text-red-500';
    case 'DAILY_PROFIT':
    case 'REFERRAL_BONUS':
      return 'text-green-500';
    case 'INVESTMENT':
      return 'text-purple-500';
    default:
      return 'text-gray-500';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'COMPLETED':
    case 'APPROVED':
    case 'PAID':
    case 'ACTIVE':
      return 'bg-green-500/20 text-green-400';
    case 'PENDING':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'REJECTED':
    case 'CANCELLED':
      return 'bg-red-500/20 text-red-400';
    default:
      return 'bg-gray-500/20 text-gray-400';
  }
}
