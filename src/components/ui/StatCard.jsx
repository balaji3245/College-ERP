import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'indigo', trend, trendValue }) {
  const colorMap = {
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', ring: 'bg-indigo-100' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', ring: 'bg-blue-100' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', ring: 'bg-green-100' },
    yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600', ring: 'bg-yellow-100' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', ring: 'bg-red-100' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', ring: 'bg-purple-100' },
    teal: { bg: 'bg-teal-50', icon: 'text-teal-600', ring: 'bg-teal-100' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', ring: 'bg-orange-100' },
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-slate-500 font-medium truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1 truncate">{subtitle}</p>}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              <span className="hidden sm:inline">{Math.abs(trendValue || trend)}% vs last month</span>
              <span className="sm:hidden">{Math.abs(trendValue || trend)}%</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-2 sm:p-3 rounded-xl flex-shrink-0 ${c.ring}`}>
            <Icon size={18} className={`sm:w-[22px] sm:h-[22px] ${c.icon}`} />
          </div>
        )}
      </div>
    </div>
  );
}
