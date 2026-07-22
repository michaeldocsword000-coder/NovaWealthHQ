'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TopBar } from '@/components/layout/Sidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { User, Lock, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await api.put('/user/profile', profile);
      await refreshUser();
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    try {
      await api.put('/user/change-password', passwords);
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      await api.post('/user/profile-picture', formData, true);
      await refreshUser();
      toast.success('Profile picture updated!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to upload picture');
    }
  };

  return (
    <DashboardLayout>
      <TopBar title="Settings" />

      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <GlassCard className="p-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  user?.username?.charAt(0).toUpperCase()
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary-500 cursor-pointer hover:bg-primary-600 transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePictureUpload} />
              </label>
            </div>
            <div>
              <h3 className="text-xl font-bold">{user?.username}</h3>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-8">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <User className="w-5 h-5" /> Profile Settings
          </h3>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              />
              <Input
                label="Last Name"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              />
            </div>
            <Input
              label="Username"
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            />
            <Button type="submit" loading={profileLoading}>Save Profile</Button>
          </form>
        </GlassCard>

        <GlassCard className="p-8">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" /> Change Password
          </h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              required
            />
            <Input
              label="New Password"
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              required
              minLength={6}
            />
            <Button type="submit" loading={passwordLoading}>Change Password</Button>
          </form>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
