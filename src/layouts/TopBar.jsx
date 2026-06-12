import { useState, useRef, useEffect } from 'react';
import { Bell, Search, ChevronDown, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';

const notifications = [
  { id: 1, text: 'New student Zara Kapoor admitted to BE CSE', time: '2h ago', read: false },
  { id: 2, text: 'Fee payment received from STU0234 - ₹42,500', time: '3h ago', read: false },
  { id: 3, text: 'Attendance marked for CSE Sem 3 Section A', time: '4h ago', read: true },
  { id: 4, text: 'Semester 4 results published for IT department', time: '5h ago', read: true },
  { id: 5, text: 'New teacher Dr. Priya Sharma joined IT dept.', time: '1d ago', read: true },
];

export default function TopBar({ sidebarCollapsed, onMenuToggle }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/students?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  return (
    <>
      <header
        className={`
          fixed top-0 right-0 z-20 h-16 bg-white border-b border-slate-200
          flex items-center justify-between px-3 sm:px-4 gap-2 sm:gap-4
          transition-all duration-300
          left-0 lg:left-auto
          ${sidebarCollapsed ? 'lg:left-16' : 'lg:left-64'}
        `}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 flex-shrink-0"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>

          <div className="relative max-w-xs w-full hidden sm:block">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search students, teachers..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 sm:hidden"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-12 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
                  <span className="text-xs text-primary-600 font-medium cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto scrollbar-thin">
                  {notifications.map((n) => (
                    <div key={n.id} className={`px-4 py-3 hover:bg-slate-50 cursor-pointer ${!n.read ? 'bg-primary-50/30' : ''}`}>
                      <div className="flex gap-3 items-start">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-primary-500' : 'bg-transparent'}`} />
                        <div>
                          <p className="text-sm text-slate-700 leading-snug">{n.text}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div ref={profileRef} className="relative">
            <button
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="User profile"
            >
              <Avatar name={user?.name || "User"} size="sm" color="4f46e5" />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-700 leading-tight">{user?.name || "User"}</p>
                <p className="text-xs text-slate-400">{user?.role || "Guest"}</p>
              </div>
              <ChevronDown size={14} className="text-slate-400 hidden md:block" />
            </button>
            {showProfile && (
              <div className="absolute right-0 top-12 w-52 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden py-1 z-50">
                <button
                  onClick={() => { navigate('/settings'); setShowProfile(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User size={15} className="text-slate-400" />
                  Profile
                </button>
                <button
                  onClick={() => { navigate('/settings'); setShowProfile(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings size={15} className="text-slate-400" />
                  Settings
                </button>
                <div className="py-1">
                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {showSearch && (
        <div className="fixed top-16 left-0 right-0 z-20 bg-white border-b border-slate-200 px-4 py-3 sm:hidden shadow-sm">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search students, teachers..."
              className="w-full pl-9 pr-9 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white"
            />
            <button onClick={() => setShowSearch(false)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
              <X size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
