import { Users, GraduationCap, Building2, BookOpen, Monitor, CalendarCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/ui/StatCard';
import BarChartWidget from '../../components/charts/BarChartWidget';
import LineChartWidget from '../../components/charts/LineChartWidget';
import PieChartWidget from '../../components/charts/PieChartWidget';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { api } from '../../services/api';
import { useState, useEffect } from 'react';
import { recentActivities } from '../../data';

const activityIcons = {
  UserPlus: GraduationCap,
  IndianRupee: BookOpen,
  CheckSquare: CalendarCheck,
  FileText: BookOpen,
  UserCheck: Users,
  Bell: Monitor,
  Calendar: CalendarCheck,
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({
    studentsByDept: [],
    attendanceTrend: [],
    feeCollectionByMonth: [],
    recentAdmissions: [],
    stats: {
      totalStudents: 0,
      totalTeachers: 0,
      totalDepartments: 0,
      totalCourses: 0,
      activeClasses: 0,
      todayAttendance: 0,
    }
  });

  useEffect(() => {
    api.getDashboardAnalytics().then(setData).catch(console.error);
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name || 'Admin'}. Here's what's happening today.</p>
        </div>
        <div className="text-xs sm:text-sm text-slate-500 bg-white border border-slate-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hidden sm:block">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <StatCard title="Total Students" value={data.stats.totalStudents.toLocaleString()} icon={GraduationCap} color="indigo" trend={4} />
        <StatCard title="Total Teachers" value={data.stats.totalTeachers} icon={Users} color="blue" trend={2} />
        <StatCard title="Departments" value={data.stats.totalDepartments} icon={Building2} color="purple" />
        <StatCard title="Courses" value={data.stats.totalCourses} icon={BookOpen} color="teal" />
        <StatCard title="Active Classes" value={data.stats.activeClasses} icon={Monitor} color="orange" />
        <StatCard title="Today's Attendance" value={`${data.stats.todayAttendance}%`} icon={CalendarCheck} color="green" trend={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 card">
          <div className="card-header">
            <h2 className="card-title">Attendance Trend</h2>
            <p className="text-xs text-slate-400 mt-0.5">Monthly attendance % by department</p>
          </div>
          <div className="p-6">
            <LineChartWidget
              data={data.attendanceTrend}
              xKey="month"
              lines={[
                { key: 'CSE', color: '#6366f1' },
                { key: 'IT', color: '#0ea5e9' },
                { key: 'EEE', color: '#f59e0b' },
                { key: 'MECH', color: '#f97316' },
                { key: 'CIVIL', color: '#10b981' },
              ]}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Students by Department</h2>
            <p className="text-xs text-slate-400 mt-0.5">Distribution across departments</p>
          </div>
          <div className="px-4 pb-4">
            <PieChartWidget data={data.studentsByDept} height={300} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Fee Collection Overview</h2>
            <p className="text-xs text-slate-400 mt-0.5">Collected vs Target (₹)</p>
          </div>
          <div className="p-6">
            <BarChartWidget
              data={data.feeCollectionByMonth}
              xKey="month"
              bars={[
                { key: 'target', name: 'Target', color: '#e2e8f0' },
                { key: 'collected', name: 'Collected', color: '#6366f1' },
              ]}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header flex items-center justify-between">
            <div>
              <h2 className="card-title">Recent Admissions</h2>
              <p className="text-xs text-slate-400 mt-0.5">Last 5 student admissions</p>
            </div>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentAdmissions.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div>
                        <p className="font-medium text-slate-800">{a.name}</p>
                        <p className="text-xs text-slate-400">{a.id}</p>
                      </div>
                    </td>
                    <td>
                      <span className="text-slate-600">{a.course}</span>
                    </td>
                    <td className="text-slate-500 text-xs">{formatDate(a.date)}</td>
                    <td>
                      <span className="badge-green">{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Activity</h2>
          <p className="text-xs text-slate-400 mt-0.5">Latest system events</p>
        </div>
        <div className="divide-y divide-slate-100">
          {recentActivities.map((activity) => {
            const Icon = activityIcons[activity.icon] || BookOpen;
            return (
              <div key={activity.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">{activity.message}</p>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">{activity.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
