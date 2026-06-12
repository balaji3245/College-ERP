import { useState } from 'react';
import { User, Lock, Bell, Palette, Shield, Save, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title flex items-center gap-2"><Icon size={16} />{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function ToggleSwitch({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary-600' : 'bg-slate-200'}`}
        role="switch"
        aria-checked={checked}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@college.edu',
    phone: '9876543000',
    role: 'System Administrator',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState({
    emailAdmissions: true,
    emailFees: true,
    emailResults: false,
    smsAdmissions: false,
    smsFees: true,
    systemAlerts: true,
  });
  const [appearance, setAppearance] = useState({
    darkMode: false,
    compactView: false,
    showAvatars: true,
  });

  const updateProfile = (field, value) => setProfile((p) => ({ ...p, [field]: value }));
  const updateNotif = (field) => setNotifications((n) => ({ ...n, [field]: !n[field] }));
  const updateAppearance = (field, val) => setAppearance((a) => ({ ...a, [field]: val }));

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="page-container max-w-3xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account and system preferences</p>
        </div>
      </div>

      <SectionCard title="Profile Settings" icon={User}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="label">Full Name</label>
            <input className="input" value={profile.name} onChange={(e) => updateProfile('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">Email Address</label>
            <input type="email" className="input" value={profile.email} onChange={(e) => updateProfile('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">Phone Number</label>
            <input className="input" value={profile.phone} onChange={(e) => updateProfile('phone', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">Role</label>
            <input className="input bg-slate-50" value={profile.role} readOnly />
          </div>
        </div>
        <div className="mt-4 flex gap-3 justify-end">
          <button className="btn-secondary">Cancel</button>
          <button className="btn-primary" onClick={handleSave}><Save size={14} /> Save Changes</button>
        </div>
      </SectionCard>

      <SectionCard title="Change Password" icon={Lock}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-group sm:col-span-2">
            <label className="label">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input pr-10"
                placeholder="Enter current password"
                value={profile.currentPassword}
                onChange={(e) => updateProfile('currentPassword', e.target.value)}
              />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="label">New Password</label>
            <input type="password" className="input" placeholder="Enter new password" value={profile.newPassword} onChange={(e) => updateProfile('newPassword', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label">Confirm Password</label>
            <input type="password" className="input" placeholder="Confirm new password" value={profile.confirmPassword} onChange={(e) => updateProfile('confirmPassword', e.target.value)} />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="btn-primary" onClick={handleSave}><Shield size={14} /> Update Password</button>
        </div>
      </SectionCard>

      <SectionCard title="Notification Preferences" icon={Bell}>
        <p className="text-xs text-slate-400 mb-4">Control when and how you receive notifications</p>
        <div className="mb-2">
          <p className="section-title mb-2">Email Notifications</p>
          <ToggleSwitch checked={notifications.emailAdmissions} onChange={() => updateNotif('emailAdmissions')} label="New Admissions" description="Get notified when a new student is admitted" />
          <ToggleSwitch checked={notifications.emailFees} onChange={() => updateNotif('emailFees')} label="Fee Payments" description="Get notified on fee payment receipts" />
          <ToggleSwitch checked={notifications.emailResults} onChange={() => updateNotif('emailResults')} label="Result Publications" description="Get notified when results are published" />
        </div>
        <div className="mt-4">
          <p className="section-title mb-2">SMS Notifications</p>
          <ToggleSwitch checked={notifications.smsAdmissions} onChange={() => updateNotif('smsAdmissions')} label="New Admissions" description="Receive SMS for new admissions" />
          <ToggleSwitch checked={notifications.smsFees} onChange={() => updateNotif('smsFees')} label="Fee Reminders" description="Receive SMS for pending fee reminders" />
          <ToggleSwitch checked={notifications.systemAlerts} onChange={() => updateNotif('systemAlerts')} label="System Alerts" description="Critical system notifications" />
        </div>
      </SectionCard>

      <SectionCard title="Appearance" icon={Palette}>
        <ToggleSwitch checked={appearance.darkMode} onChange={(v) => updateAppearance('darkMode', v)} label="Dark Mode" description="Switch to dark color theme (coming soon)" />
        <ToggleSwitch checked={appearance.compactView} onChange={(v) => updateAppearance('compactView', v)} label="Compact View" description="Reduce spacing in tables and lists" />
        <ToggleSwitch checked={appearance.showAvatars} onChange={(v) => updateAppearance('showAvatars', v)} label="Show Avatars" description="Display student and teacher initials avatars" />
      </SectionCard>
    </div>
  );
}
