import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, GraduationCap, Building2, BookOpen,
  ClipboardCheck, FileBarChart2, CreditCard, FolderOpen,
  BarChart3, Settings, ChevronLeft, ChevronRight, School, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Teacher', 'Student', 'Parent'] },
  { path: '/students', label: 'Students', icon: GraduationCap, roles: ['Admin', 'Teacher'] },
  { path: '/teachers', label: 'Teachers', icon: Users, roles: ['Admin'] },
  { path: '/departments', label: 'Departments', icon: Building2, roles: ['Admin', 'Teacher'] },
  { path: '/courses', label: 'Courses', icon: BookOpen, roles: ['Admin', 'Teacher', 'Student'] },
  { path: '/attendance', label: 'Attendance', icon: ClipboardCheck, roles: ['Admin', 'Teacher', 'Student', 'Parent'] },
  { path: '/results', label: 'Results', icon: FileBarChart2, roles: ['Admin', 'Teacher', 'Student', 'Parent'] },
  { path: '/fees', label: 'Fees Management', icon: CreditCard, roles: ['Admin', 'Student', 'Parent'] },
  { path: '/documents', label: 'Documents', icon: FolderOpen, roles: ['Admin', 'Teacher', 'Student'] },
  { path: '/reports', label: 'Reports', icon: BarChart3, roles: ['Admin'] },
  { path: '/settings', label: 'Settings', icon: Settings, roles: ['Admin'] },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const { user } = useAuth();
  
  // Filter nav items based on user role. Default to Admin if user is missing for some reason.
  const role = user?.role || 'Admin';
  const filteredNavItems = navItems.filter(item => item.roles.some((r) => r.toLowerCase() === role.toLowerCase()));

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-40 flex flex-col
        transition-all duration-300
        ${collapsed ? 'lg:w-16' : 'lg:w-64'}
        w-72
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      <div className={`flex items-center h-16 border-b border-slate-200 px-4 ${collapsed ? 'lg:justify-center' : 'gap-3'}`}>
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <School size={16} className="text-white" />
        </div>
        <div className={`min-w-0 flex-1 ${collapsed ? 'lg:hidden' : ''}`}>
          <p className="text-sm font-bold text-slate-800 leading-tight truncate">College ERP</p>
          <p className="text-xs text-slate-400 truncate">Management System</p>
        </div>
        <button
          onClick={onMobileClose}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 lg:hidden flex-shrink-0"
          aria-label="Close sidebar"
        >
          <X size={16} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5 scrollbar-thin">
        {filteredNavItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'} sidebar-link ${collapsed ? 'lg:justify-center lg:px-2' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            <span className={`truncate ${collapsed ? 'lg:hidden' : ''}`}>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-2 border-t border-slate-200 hidden lg:block">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
