import { useState, useEffect, useMemo } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, Download, TrendingUp, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../services/api';
import BarChartWidget from '../../components/charts/BarChartWidget';
import SearchInput from '../../components/ui/SearchInput';
import { useSearch } from '../../hooks/useSearch';
import { useAuth } from '../../context/AuthContext';

const statusIcon = { Present: CheckCircle, Absent: XCircle, Late: Clock, Leave: AlertCircle };
const statusColor = { Present: 'text-green-500', Absent: 'text-red-500', Late: 'text-yellow-500', Leave: 'text-blue-500' };
const statusBadge = { Present: 'badge-green', Absent: 'badge-red', Late: 'badge-yellow', Leave: 'badge-blue' };

export default function AttendancePage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'Student' || user?.role === 'Parent';

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [deptFilter, setDeptFilter] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceTrend, setAttendanceTrend] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attData, stuData, deptData] = await Promise.all([
          api.getAttendance(),
          api.getStudents(),
          api.getDepartments()
        ]);
        setAttendance(attData);
        setStudents(stuData);
        setDepartments(deptData);
      } catch (err) {
        toast.error('Failed to fetch attendance data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // Load attendance trend for admin chart
    api.getDashboardAnalytics().then(d => setAttendanceTrend(d.attendanceTrend || [])).catch(() => {});
  }, []);

  // Merge attendance with student data
  const enrichedAttendance = useMemo(() => {
    return attendance.map(a => {
      const stu = students.find(s => s.id === a.studentId) || {};
      const dept = departments.find(d => d.id === stu.departmentId) || {};
      return {
        ...a,
        studentName: stu.firstName ? `${stu.firstName} ${stu.lastName}` : 'Unknown Student',
        rollNumber: stu.rollNumber || 'N/A',
        departmentId: dept.id,
        departmentName: dept.name || 'Unknown',
        courseName: stu.courseId || 'N/A',
        semester: stu.semester || 1
      };
    });
  }, [attendance, students, departments]);

  const { query, setQuery, filtered: searchFiltered } = useSearch(enrichedAttendance, ['studentName', 'rollNumber', 'departmentName']);

  // For student: filter attendance to only their records
  const studentData = isStudent ? students.find(s => s.id === user?.linkedId) || students[0] : null;
  const studentAttendance = isStudent ? enrichedAttendance.filter(r => r.studentId === user?.linkedId) : [];

  const filtered = useMemo(() => {
    if (isStudent) return studentAttendance;
    return searchFiltered.filter((r) => {
      if (deptFilter && r.departmentId !== deptFilter) return false;
      return true;
    });
  }, [searchFiltered, deptFilter, isStudent, studentAttendance]);

  const summary = useMemo(() => ({
    present: filtered.filter(r => r.status === 'Present').length,
    absent: filtered.filter(r => r.status === 'Absent').length,
    late: filtered.filter(r => r.status === 'Late').length,
    leave: filtered.filter(r => r.status === 'Leave').length,
    total: filtered.length,
  }), [filtered]);

  const attendancePct = summary.total > 0
    ? Math.round(((summary.present + summary.late) / summary.total) * 100)
    : (studentData?.attendancePercentage || 0);

  // ── STUDENT / PARENT VIEW ─────────────────────────────────────────────
  if (isStudent) {
    const recentRecords = [...enrichedAttendance]
      .filter(r => r.studentId === (user?.linkedId || 'STU001'))
      .slice(0, 10);

    // Mock monthly attendance since backend doesn't have it yet
    const studentMonthly = [
      { month: 'Jan', myAttendance: 85 },
      { month: 'Feb', myAttendance: 88 },
      { month: 'Mar', myAttendance: 90 },
      { month: 'Apr', myAttendance: 82 }
    ];

    return (
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">{user?.role === 'Parent' ? "Child's Attendance" : 'My Attendance'}</h1>
            <p className="page-subtitle">Attendance records for {studentData?.fullName}</p>
          </div>
          <button onClick={() => toast.success('Attendance report downloading...')} className="btn-secondary hidden sm:flex">
            <Download size={15} /> Download Report
          </button>
        </div>

        {/* Attendance Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Present', count: recentRecords.filter(r => r.status === 'Present').length, color: 'bg-green-50 border-green-200', textColor: 'text-green-700', iconColor: 'text-green-500', icon: CheckCircle },
            { label: 'Absent', count: recentRecords.filter(r => r.status === 'Absent').length, color: 'bg-red-50 border-red-200', textColor: 'text-red-700', iconColor: 'text-red-500', icon: XCircle },
            { label: 'Late', count: recentRecords.filter(r => r.status === 'Late').length, color: 'bg-yellow-50 border-yellow-200', textColor: 'text-yellow-700', iconColor: 'text-yellow-500', icon: Clock },
            { label: 'On Leave', count: recentRecords.filter(r => r.status === 'Leave').length, color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700', iconColor: 'text-blue-500', icon: AlertCircle },
          ].map(item => (
            <div key={item.label} className={`card border ${item.color} p-5 flex items-center gap-4`}>
              <item.icon size={28} className={item.iconColor} />
              <div>
                <p className={`text-3xl font-bold ${item.textColor}`}>{item.count}</p>
                <p className="text-sm text-slate-500">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Attendance */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-bold text-slate-800 text-lg">Overall Attendance</h2>
              <p className="text-slate-500 text-sm">Academic Year 2024-25</p>
            </div>
            <div className="text-right">
              <p className={`text-4xl font-bold ${studentData?.attendancePercentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                {studentData?.attendancePercentage}%
              </p>
              <p className={`text-sm font-medium ${studentData?.attendancePercentage >= 75 ? 'text-green-600' : 'text-red-500'}`}>
                {studentData?.attendancePercentage >= 75 ? '✓ Good Standing' : '⚠ Below Required 75%'}
              </p>
            </div>
          </div>
          <div className="mt-4 w-full bg-slate-100 rounded-full h-4 overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all ${studentData?.attendancePercentage >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${studentData?.attendancePercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0%</span>
            <span className="text-orange-500 font-medium">Required: 75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Monthly Chart */}
        <div className="card mb-6">
          <div className="card-header"><h2 className="card-title flex items-center gap-2"><TrendingUp size={16} /> Monthly Attendance Trend</h2></div>
          <div className="p-6">
            <BarChartWidget data={studentMonthly} xKey="month" bars={[{ key: 'myAttendance', name: 'Attendance %', color: '#6366f1' }]} />
          </div>
        </div>

        {/* Recent Records */}
        <div className="card">
          <div className="card-header"><h2 className="card-title flex items-center gap-2"><Calendar size={16} /> Recent Attendance</h2></div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th><th>Date</th><th>Subject / Session</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRecords.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-10 text-slate-400">No attendance records found.</td></tr>
                ) : (
                  recentRecords.map((record, idx) => {
                    const Icon = statusIcon[record.status];
                    return (
                      <tr key={idx}>
                        <td className="text-slate-400 text-xs">{idx + 1}</td>
                        <td className="text-slate-700 font-medium">{record.date}</td>
                        <td className="text-slate-600">{record.courseName} · Sem {record.semester}</td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <Icon size={14} className={statusColor[record.status]} />
                            <span className={statusBadge[record.status]}>{record.status}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ── ADMIN/TEACHER VIEW ──────────────────────────────────────────────────
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="page-subtitle">Track and manage student attendance</p>
        </div>
        <button className="btn-secondary" onClick={() => toast.success('Exporting attendance report...')}>
          <Download size={15} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Present', count: summary.present, color: 'bg-green-50 border-green-200', textColor: 'text-green-700', icon: CheckCircle, iconColor: 'text-green-500' },
          { label: 'Absent', count: summary.absent, color: 'bg-red-50 border-red-200', textColor: 'text-red-700', icon: XCircle, iconColor: 'text-red-500' },
          { label: 'Late', count: summary.late, color: 'bg-yellow-50 border-yellow-200', textColor: 'text-yellow-700', icon: Clock, iconColor: 'text-yellow-500' },
          { label: 'On Leave', count: summary.leave, color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700', icon: AlertCircle, iconColor: 'text-blue-500' },
        ].map((item) => (
          <div key={item.label} className={`card border ${item.color} p-5 flex items-center gap-4`}>
            <item.icon size={28} className={item.iconColor} />
            <div>
              <p className={`text-2xl font-bold ${item.textColor}`}>{item.count}</p>
              <p className="text-sm text-slate-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><h2 className="card-title">Monthly Attendance Statistics</h2></div>
        <div className="p-6">
          <BarChartWidget
            data={attendanceTrend.length > 0 ? attendanceTrend.map(m => ({ month: m.month, avgAttendance: Math.round(Object.values(m).filter(v => typeof v === 'number').reduce((a, b) => a + b, 0) / Math.max(Object.values(m).filter(v => typeof v === 'number').length, 1)) })) : [{ month: 'Loading...', avgAttendance: 0 }]}
            xKey="month"
            bars={[{ key: 'avgAttendance', name: 'Avg Attendance %', color: '#6366f1' }]}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="flex flex-wrap gap-3 items-center justify-between w-full">
            <h2 className="card-title">Daily Attendance</h2>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="input w-auto text-sm flex-1 sm:flex-none" />
              <SearchInput value={query} onChange={setQuery} placeholder="Search students..." className="flex-1 sm:w-48" />
              <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="select w-auto flex-1 sm:flex-none text-xs sm:text-sm">
                <option value="">All Depts</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.shortName}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>#</th><th>Student</th><th>Roll Number</th><th>Department</th>
                <th>Course</th><th>Semester</th><th>Date</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-10 text-slate-400">Loading attendance...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-slate-400">No records found.</td></tr>
              ) : filtered.map((record, idx) => {
                const Icon = statusIcon[record.status] || CheckCircle;
                return (
                  <tr key={idx}>
                    <td className="text-slate-400 text-xs">{idx + 1}</td>
                    <td className="font-medium text-slate-800">{record.studentName}</td>
                    <td className="font-mono text-xs text-slate-500">{record.rollNumber}</td>
                    <td className="text-sm text-slate-600">{record.departmentName}</td>
                    <td className="text-sm text-slate-600">{record.courseName}</td>
                    <td className="text-center text-sm text-slate-600">Sem {record.semester}</td>
                    <td className="text-sm text-slate-500">{record.date}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Icon size={14} className={statusColor[record.status] || statusColor.Present} />
                        <span className={statusBadge[record.status] || statusBadge.Present}>{record.status}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
