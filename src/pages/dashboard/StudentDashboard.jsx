import { useAuth } from '../../context/AuthContext';
import { students, results, fees, dailyAttendance, courses } from '../../data';
import StatCard from '../../components/ui/StatCard';
import {
  CalendarCheck, Award, IndianRupee, BookOpen,
  Clock, AlertCircle, CheckCircle, TrendingUp, FileText, Bell
} from 'lucide-react';
import { formatCurrency, getGradeBadge } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import BarChartWidget from '../../components/charts/BarChartWidget';
import toast from 'react-hot-toast';

const NOTICES = [
  { id: 1, title: 'Mid-Semester Examination Schedule', date: 'Sep 10, 2025', tag: 'Exam', tagColor: 'bg-red-100 text-red-700' },
  { id: 2, title: 'Annual Sports Day Registration Open', date: 'Sep 5, 2025', tag: 'Event', tagColor: 'bg-green-100 text-green-700' },
  { id: 3, title: 'Fee Payment Deadline – 30 Sep 2025', date: 'Sep 1, 2025', tag: 'Finance', tagColor: 'bg-orange-100 text-orange-700' },
  { id: 4, title: 'Library Card Renewal – Last Date 20 Sep', date: 'Aug 28, 2025', tag: 'General', tagColor: 'bg-blue-100 text-blue-700' },
];

const TIMETABLE = [
  { day: 'Mon', slots: [{ time: '9-10am', sub: 'Data Structures' }, { time: '10-11am', sub: 'Algorithms' }, { time: '12-1pm', sub: 'DBMS' }] },
  { day: 'Tue', slots: [{ time: '9-10am', sub: 'OS' }, { time: '11-12pm', sub: 'CN Lab' }, { time: '2-3pm', sub: 'Math' }] },
  { day: 'Wed', slots: [{ time: '9-10am', sub: 'Data Structures' }, { time: '10-11am', sub: 'DBMS' }, { time: '2-3pm', sub: 'Algorithms' }] },
  { day: 'Thu', slots: [{ time: '9-10am', sub: 'Math' }, { time: '11-12pm', sub: 'DS Lab' }, { time: '2-3pm', sub: 'OS' }] },
  { day: 'Fri', slots: [{ time: '9-10am', sub: 'CN' }, { time: '10-11am', sub: 'DBMS Lab' }, { time: '2-3pm', sub: 'Seminar' }] },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const studentId = user?.mockId || 'STU001';
  const studentData = students.find(s => s.id === studentId) || students[0];
  const resultData = results.find(r => r.studentId === studentId) || results[0];
  const feeData = fees.find(f => f.studentId === studentId) || fees[0];

  const todayAttendanceRecords = dailyAttendance.filter(r => r.studentId === studentId);
  const presentCount = todayAttendanceRecords.filter(r => r.status === 'Present').length;

  const isParent = user?.role === 'Parent';
  const paidPct = Math.round((feeData.paidAmount / feeData.totalFees) * 100);

  const chartData = resultData.subjects.map(s => ({
    subject: s.subject.substring(0, 8),
    marks: s.total
  }));

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const todayDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
  const todaySchedule = TIMETABLE.find(t => t.day === todayDay)?.slots || TIMETABLE[0].slots;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{isParent ? `${studentData.fullName.split(' ')[0]}'s Dashboard` : 'My Dashboard'}</h1>
          <p className="page-subtitle">
            {isParent
              ? `Tracking progress of ${studentData.fullName}`
              : `Welcome back, ${studentData.fullName.split(' ')[0]}! Here's your academic overview.`}
          </p>
        </div>
        <div className="text-xs sm:text-sm text-slate-500 bg-white border border-slate-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hidden sm:block">{today}</div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard title="Current GPA" value={resultData.gpa} icon={Award} color="indigo" />
        <StatCard title="Attendance" value={`${studentData.attendancePercentage}%`} icon={CalendarCheck} color={studentData.attendancePercentage >= 75 ? 'green' : 'red'} />
        <StatCard title="Pending Fees" value={formatCurrency(feeData.pendingAmount)} icon={IndianRupee} color={feeData.pendingAmount > 0 ? 'orange' : 'green'} />
        <StatCard title="Total Subjects" value={resultData.subjects.length} icon={BookOpen} color="blue" />
      </div>

      {/* Fee Alert if pending */}
      {feeData.pendingAmount > 0 && (
        <div className="mb-6 bg-orange-50 border border-orange-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-orange-800">Fee Payment Due</p>
              <p className="text-sm text-orange-700">
                You have a pending fee of <strong>{formatCurrency(feeData.pendingAmount)}</strong> due on <strong>{feeData.dueDate}</strong>.
              </p>
            </div>
          </div>
          <button onClick={() => navigate('/fees')} className="btn-primary whitespace-nowrap flex-shrink-0 bg-orange-600 hover:bg-orange-700 border-orange-600">
            Pay Now
          </button>
        </div>
      )}

      {/* Main Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* === LEFT (2/3) === */}
        <div className="lg:col-span-2 space-y-6">

          {/* Recent Results */}
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h2 className="card-title">Latest Results — Sem {resultData.semester}</h2>
              <button onClick={() => navigate('/results')} className="text-sm font-medium text-primary-600 hover:text-primary-700">View All →</button>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th className="text-center">Internal</th>
                    <th className="text-center">External</th>
                    <th className="text-center">Total</th>
                    <th className="text-center">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {resultData.subjects.map((sub) => (
                    <tr key={sub.subject}>
                      <td className="font-medium text-slate-800">{sub.subject}</td>
                      <td className="text-center text-slate-600">{sub.internal}</td>
                      <td className="text-center text-slate-600">{sub.external}</td>
                      <td className={`text-center font-semibold ${sub.total < 40 ? 'text-red-600' : 'text-slate-800'}`}>{sub.total}</td>
                      <td className="text-center"><span className={getGradeBadge(sub.grade)}>{sub.grade}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 flex items-center justify-between border-t border-slate-100">
              <span className="text-sm text-slate-600">GPA: <strong className="text-primary-600">{resultData.gpa}</strong></span>
              <span className="text-sm text-slate-600">Credits: <strong>{resultData.earnedCredits}/{resultData.totalCredits}</strong></span>
              <span className={`font-bold text-sm ${resultData.result === 'PASS' ? 'text-green-600' : 'text-red-500'}`}>{resultData.result}</span>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2"><TrendingUp size={16} /> Subject Performance</h2>
            </div>
            <div className="p-6">
              <BarChartWidget data={chartData} xKey="subject" bars={[{ key: 'marks', name: 'Marks (out of 100)', color: '#6366f1' }]} />
            </div>
          </div>

          {/* Attendance Overview */}
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h2 className="card-title flex items-center gap-2"><CalendarCheck size={16} /> Attendance Overview</h2>
              <button onClick={() => navigate('/attendance')} className="text-sm font-medium text-primary-600 hover:text-primary-700">View Details →</button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-600 font-medium">Overall Attendance</span>
                <span className={`text-2xl font-bold ${studentData.attendancePercentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                  {studentData.attendancePercentage}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full ${studentData.attendancePercentage >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${studentData.attendancePercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>0%</span>
                <span className="text-orange-500 font-medium">Min. Required: 75%</span>
                <span>100%</span>
              </div>
              {studentData.attendancePercentage < 75 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
                  ⚠ Your attendance is below the required 75%. Please attend more classes to avoid exam restrictions.
                </div>
              )}
              {studentData.attendancePercentage >= 75 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700">
                  ✓ Your attendance is in good standing. Keep it up!
                </div>
              )}
            </div>
          </div>

        </div>

        {/* === RIGHT (1/3) === */}
        <div className="space-y-6">

          {/* Student Profile Card */}
          <div className="card p-6 text-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
              <span className="text-2xl font-bold text-primary-600">{studentData.fullName.charAt(0)}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800">{studentData.fullName}</h3>
            <p className="text-sm text-slate-500 mb-1">{studentData.rollNumber}</p>
            <p className="text-xs text-slate-400 mb-5">{studentData.courseName}</p>
            <div className="space-y-2 text-sm text-left bg-slate-50 rounded-lg p-4">
              <div className="flex justify-between"><span className="text-slate-500">Department</span><span className="font-medium text-slate-800">{studentData.departmentName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Semester</span><span className="font-medium text-slate-800">Sem {resultData.semester}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Section</span><span className="font-medium text-slate-800">{studentData.section || 'A'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Admission</span><span className="font-medium text-slate-800">{studentData.admissionDate || '2023-08-01'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="badge-green">Active</span></div>
            </div>
          </div>

          {/* Today's Classes */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2"><Clock size={16} /> Today's Schedule</h2>
            </div>
            <div className="p-0">
              {todaySchedule.map((slot, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 border-b border-slate-100 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 text-sm">{slot.sub}</p>
                    <p className="text-xs text-slate-400">{slot.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Exams */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2"><FileText size={16} /> Upcoming Exams</h2>
            </div>
            <div className="p-0">
              {[
                { subject: 'Data Structures', date: 'Sep 12', type: 'Mid-Term', days: 2 },
                { subject: 'Algorithms', date: 'Sep 15', type: 'Mid-Term', days: 5 },
                { subject: 'DBMS', date: 'Sep 18', type: 'Mid-Term', days: 8 },
              ].map((exam, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 border-b border-slate-100 last:border-0">
                  <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center flex-shrink-0 ${exam.days <= 3 ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    <span className="text-[10px] font-bold uppercase">Sep</span>
                    <span className="text-lg font-bold leading-none">{exam.date.split(' ')[1]}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 text-sm">{exam.subject}</p>
                    <p className="text-xs text-slate-500">{exam.type} · In {exam.days} days</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notice Board */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2"><Bell size={16} /> Notice Board</h2>
            </div>
            <div className="p-0">
              {NOTICES.map((notice) => (
                <div key={notice.id} className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => toast.success(notice.title)}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-slate-800 leading-tight">{notice.title}</p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${notice.tagColor}`}>{notice.tag}</span>
                  </div>
                  <p className="text-xs text-slate-400">{notice.date}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
