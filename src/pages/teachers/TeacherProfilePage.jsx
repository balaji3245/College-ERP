import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, BookOpen, Award, Calendar } from 'lucide-react';
import { teachers } from '../../data';
import Avatar from '../../components/ui/Avatar';
import { formatDate } from '../../utils/helpers';

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500 sm:w-44 font-medium">{label}</span>
      <span className="text-sm text-slate-800">{value || '-'}</span>
    </div>
  );
}

export default function TeacherProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const teacher = teachers.find((t) => t.id === id);

  if (!teacher) {
    return (
      <div className="page-container text-center py-24">
        <p className="text-lg font-semibold text-slate-700">Teacher not found</p>
        <button onClick={() => navigate('/teachers')} className="btn-primary mt-4">Back to Teachers</button>
      </div>
    );
  }

  const colors = ['6366f1', '0ea5e9', '10b981', 'f59e0b', 'ef4444', '8b5cf6', '14b8a6', 'f97316'];
  const colorIdx = parseInt(teacher.id.replace('T', '')) % colors.length;

  return (
    <div className="page-container">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate('/teachers')} className="btn-ghost btn-sm">
          <ArrowLeft size={15} /> Back
        </button>
      </div>

      <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <Avatar name={teacher.fullName} size="xl" color={colors[colorIdx]} />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800">{teacher.fullName}</h1>
            <span className={teacher.status === 'Active' ? 'badge-green' : 'badge-yellow'}>{teacher.status}</span>
          </div>
          <p className="text-slate-500 mt-1">{teacher.designation} · {teacher.departmentName}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2">
            <p className="text-sm text-slate-500 flex items-center gap-1.5"><Mail size={14} />{teacher.email}</p>
            <p className="text-sm text-slate-500 flex items-center gap-1.5"><Phone size={14} />{teacher.phone}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="badge-indigo">{teacher.qualification}</span>
            <span className="badge-gray">{teacher.experience} years experience</span>
            <span className="badge-blue">{teacher.classesPerWeek} classes/week</span>
          </div>
        </div>
        <button className="btn-primary btn-sm flex-shrink-0">Edit Profile</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header"><h2 className="card-title">Personal Information</h2></div>
          <div className="px-6 pb-6">
            <InfoRow label="Employee ID" value={teacher.employeeId} />
            <InfoRow label="Full Name" value={teacher.fullName} />
            <InfoRow label="Gender" value={teacher.gender} />
            <InfoRow label="Date of Birth" value={formatDate(teacher.dob)} />
            <InfoRow label="Blood Group" value={teacher.bloodGroup} />
            <InfoRow label="Joining Date" value={formatDate(teacher.joiningDate)} />
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h2 className="card-title">Contact Information</h2></div>
          <div className="px-6 pb-6">
            <InfoRow label="Email" value={teacher.email} />
            <InfoRow label="Phone" value={teacher.phone} />
            <InfoRow label="Alternate Phone" value={teacher.alternatePhone} />
            <InfoRow label="Address" value={teacher.address} />
            <InfoRow label="City" value={teacher.city} />
            <InfoRow label="State" value={teacher.state} />
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h2 className="card-title flex items-center gap-2"><Award size={16} />Academic Profile</h2></div>
          <div className="px-6 pb-6">
            <InfoRow label="Department" value={teacher.departmentName} />
            <InfoRow label="Designation" value={teacher.designation} />
            <InfoRow label="Qualification" value={teacher.qualification} />
            <InfoRow label="Specialization" value={teacher.specialization} />
            <InfoRow label="Experience" value={`${teacher.experience} years`} />
            <InfoRow label="Salary (Monthly)" value={`₹${teacher.salary.toLocaleString('en-IN')}`} />
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h2 className="card-title flex items-center gap-2"><BookOpen size={16} />Assigned Subjects</h2></div>
          <div className="p-6 space-y-3">
            {teacher.assignedSubjects.map((sub, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <BookOpen size={14} className="text-primary-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
