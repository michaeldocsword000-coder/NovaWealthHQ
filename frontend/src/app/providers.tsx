'use client';

import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'glass-card !bg-white/90 dark:!bg-gray-900/90',
            duration: 4000,
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
