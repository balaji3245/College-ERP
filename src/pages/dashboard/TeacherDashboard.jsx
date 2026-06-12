import { useAuth } from '../../context/AuthContext';
import { teachers, courses, students } from '../../data';
import StatCard from '../../components/ui/StatCard';
import { Users, BookOpen, Clock, CalendarCheck, CheckCircle } from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuth();

  // Find user data
  const teacherData = { 
    fullName: user?.name || 'Faculty Member', 
    designation: 'Professor', 
    departmentName: 'Computer Science', 
    employeeId: user?.linkedId || 'T001' 
  };

  // Mock schedule data for this teacher
  const schedule = [
    { time: '09:00 AM - 10:30 AM', subject: 'Data Structures', class: 'CSE Sem 3 - Sec A', type: 'Lecture', status: 'Completed' },
    { time: '11:00 AM - 12:30 PM', subject: 'Algorithms Lab', class: 'CSE Sem 3 - Sec B', type: 'Practical', status: 'Ongoing' },
    { time: '02:00 PM - 03:00 PM', subject: 'Database Management', class: 'IT Sem 4 - Sec A', type: 'Lecture', status: 'Upcoming' },
  ];

  const pendingGrading = 32;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Faculty Dashboard</h1>
          <p className="page-subtitle">Welcome back, {teacherData.fullName}. Here is your schedule for today.</p>
        </div>
        <div className="text-xs sm:text-sm text-slate-500 bg-white border border-slate-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hidden sm:block">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard title="Assigned Classes" value="3" icon={BookOpen} color="indigo" />
        <StatCard title="Total Students" value="145" icon={Users} color="blue" />
        <StatCard title="Avg Attendance" value="88%" icon={CalendarCheck} color="green" />
        <StatCard title="Pending Grading" value={pendingGrading.toString()} icon={Clock} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Schedule */}
        <div className="lg:col-span-2 card">
          <div className="card-header">
            <h2 className="card-title">Today's Schedule</h2>
          </div>
          <div className="p-0">
            {schedule.map((slot, idx) => (
              <div key={idx} className="p-5 border-b border-slate-100 last:border-0 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-full sm:w-48 text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Clock size={16} className="text-slate-400" />
                  {slot.time}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-base">{slot.subject}</h4>
                  <p className="text-sm text-slate-500">{slot.class} • {slot.type}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    slot.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    slot.status === 'Ongoing' ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-200 ring-offset-2' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {slot.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Profile & Actions */}
        <div className="space-y-6">
          <div className="card p-6 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
              <span className="text-2xl font-bold text-blue-600">{teacherData.fullName.charAt(0)}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800">{teacherData.fullName}</h3>
            <p className="text-sm text-slate-500 mb-4">{teacherData.designation}</p>
            
            <div className="flex flex-col gap-2 text-left bg-slate-50 rounded-lg p-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Department</span>
                <span className="font-medium text-slate-800">{teacherData.departmentName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Employee ID</span>
                <span className="font-medium text-slate-800">{teacherData.employeeId}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Quick Actions</h2>
            </div>
            <div className="p-2 flex flex-col">
              <button className="flex items-center gap-3 p-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 rounded-lg">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><CalendarCheck size={18} /></div>
                <div>
                  <p className="font-bold text-sm text-slate-800">Mark Attendance</p>
                  <p className="text-xs text-slate-500">Update today's attendance</p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 rounded-lg">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle size={18} /></div>
                <div>
                  <p className="font-bold text-sm text-slate-800">Grade Assignments</p>
                  <p className="text-xs text-slate-500">You have {pendingGrading} pending</p>
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
