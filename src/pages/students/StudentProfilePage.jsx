import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft, User, Phone, MapPin, Users, GraduationCap,
  Calendar, FileText, CreditCard, BookOpen, Download, Mail
} from 'lucide-react';
import { students } from '../../data';
import Tabs from '../../components/ui/Tabs';
import Avatar from '../../components/ui/Avatar';
import ProgressBar from '../../components/ui/ProgressBar';
import { formatDate, formatCurrency, getStudentStatusBadge, getFeeStatusBadge, getGradeBadge, getDocumentStatusBadge, getSemesterLabel } from '../../utils/helpers';

const tabList = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'academic', label: 'Academic', icon: GraduationCap },
  { id: 'attendance', label: 'Attendance', icon: Calendar },
  { id: 'fees', label: 'Fees', icon: CreditCard },
  { id: 'subjects', label: 'Subjects', icon: BookOpen },
  { id: 'documents', label: 'Documents', icon: FileText },
];

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500 sm:w-44 font-medium">{label}</span>
      <span className="text-sm text-slate-800 mt-0.5 sm:mt-0">{value || '-'}</span>
    </div>
  );
}

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');

  const student = students.find((s) => s.id === id);

  if (!student) {
    return (
      <div className="page-container">
        <div className="text-center py-24">
          <p className="text-lg font-semibold text-slate-700">Student not found</p>
          <button onClick={() => navigate('/students')} className="btn-primary mt-4">
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  const colors = ['6366f1', '0ea5e9', '10b981', 'f59e0b', 'ef4444', '8b5cf6', '14b8a6', 'f97316'];
  const colorIdx = parseInt(student.id.replace('STU', '')) % colors.length;

  return (
    <div className="page-container">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate('/students')} className="btn-ghost btn-sm">
          <ArrowLeft size={15} />
          Back
        </button>
      </div>

      <div className="card p-4 sm:p-6 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
        <Avatar name={student.fullName} size="xl" color={colors[colorIdx]} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{student.fullName}</h1>
            <span className={getStudentStatusBadge(student.status)}>{student.status}</span>
          </div>
          <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-1 mt-2">
            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5"><GraduationCap size={13} /> {student.rollNumber}</p>
            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 break-all"><Mail size={13} /> {student.email}</p>
            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5"><Phone size={13} /> {student.phone}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3">
            <span className="badge-indigo text-xs">{student.departmentName.split(' ')[0]}</span>
            <span className="badge-blue text-xs">{student.courseName}</span>
            <span className="badge-gray text-xs">{getSemesterLabel(student.semester)}</span>
            <span className="badge-gray text-xs">Sec {student.section}</span>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0 self-start">
          <button className="btn-secondary btn-sm"><FileText size={14} /> <span className="hidden sm:inline">Export</span></button>
          <button className="btn-primary btn-sm"><span className="hidden sm:inline">Edit </span>Student</button>
        </div>
      </div>

      <Tabs tabs={tabList} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'personal' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header"><h2 className="card-title flex items-center gap-2"><User size={16} /> Personal Information</h2></div>
            <div className="px-6 pb-6">
              <InfoRow label="Student ID" value={student.id} />
              <InfoRow label="Roll Number" value={student.rollNumber} />
              <InfoRow label="Full Name" value={student.fullName} />
              <InfoRow label="Gender" value={student.gender} />
              <InfoRow label="Date of Birth" value={formatDate(student.dob)} />
              <InfoRow label="Blood Group" value={student.bloodGroup} />
              <InfoRow label="Nationality" value={student.nationality} />
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h2 className="card-title flex items-center gap-2"><Phone size={16} /> Contact Information</h2></div>
            <div className="px-6 pb-6">
              <InfoRow label="Mobile Number" value={student.phone} />
              <InfoRow label="Alternate Mobile" value={student.alternatePhone} />
              <InfoRow label="Email" value={student.email} />
              <InfoRow label="Address" value={student.address} />
              <InfoRow label="City" value={student.city} />
              <InfoRow label="State" value={student.state} />
              <InfoRow label="Pincode" value={student.pincode} />
            </div>
          </div>
          <div className="card lg:col-span-2">
            <div className="card-header"><h2 className="card-title flex items-center gap-2"><Users size={16} /> Parent / Guardian Information</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="px-6 py-4">
                <p className="section-title mb-3">Father</p>
                <InfoRow label="Name" value={student.fatherName} />
                <InfoRow label="Occupation" value={student.fatherOccupation} />
                <InfoRow label="Mobile" value={student.fatherPhone} />
              </div>
              <div className="px-6 py-4">
                <p className="section-title mb-3">Mother</p>
                <InfoRow label="Name" value={student.motherName} />
                <InfoRow label="Occupation" value={student.motherOccupation} />
                <InfoRow label="Mobile" value={student.motherPhone} />
              </div>
              <div className="px-6 py-4">
                <p className="section-title mb-3">Guardian</p>
                <InfoRow label="Name" value={student.guardianName} />
                <InfoRow label="Contact" value={student.guardianContact} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'academic' && (
        <div className="card">
          <div className="card-header"><h2 className="card-title flex items-center gap-2"><GraduationCap size={16} /> Academic Information</h2></div>
          <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <InfoRow label="Department" value={student.departmentName} />
            <InfoRow label="Course" value={student.courseName} />
            <InfoRow label="Semester" value={getSemesterLabel(student.semester)} />
            <InfoRow label="Section" value={`Section ${student.section}`} />
            <InfoRow label="Academic Year" value={student.academicYear} />
            <InfoRow label="Admission Date" value={formatDate(student.admissionDate)} />
            <InfoRow label="Student Status" value={student.status} />
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="card">
          <div className="card-header"><h2 className="card-title flex items-center gap-2"><Calendar size={16} /> Attendance Summary</h2></div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Working Days', value: student.totalWorkingDays, color: 'text-slate-800' },
                { label: 'Present Days', value: student.presentDays, color: 'text-green-600' },
                { label: 'Absent Days', value: student.absentDays, color: 'text-red-500' },
                { label: 'Attendance %', value: `${student.attendancePercentage}%`, color: student.attendancePercentage >= 75 ? 'text-green-600' : 'text-red-500' },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-600">Attendance Progress</p>
              <ProgressBar value={student.presentDays} max={student.totalWorkingDays} />
              {student.attendancePercentage < 75 && (
                <p className="text-xs text-red-500 font-medium">⚠ Attendance below required 75% threshold</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fees' && (
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="card-title flex items-center gap-2"><CreditCard size={16} /> Fee Summary</h2>
            <span className={getFeeStatusBadge(student.feeStatus)}>{student.feeStatus}</span>
          </div>
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {[
                { label: 'Total Fees', value: formatCurrency(student.totalFees), color: 'text-slate-800' },
                { label: 'Paid', value: formatCurrency(student.paidAmount), color: 'text-green-600' },
                { label: 'Pending', value: formatCurrency(student.pendingAmount), color: 'text-red-500' },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 rounded-xl p-3 sm:p-4 text-center">
                  <p className={`text-sm sm:text-xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
            <ProgressBar value={student.paidAmount} max={student.totalFees} />
          </div>
        </div>
      )}

      {activeTab === 'subjects' && (
        <div className="card">
          <div className="card-header"><h2 className="card-title flex items-center gap-2"><BookOpen size={16} /> Enrolled Subjects</h2></div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Subject Code</th>
                  <th>Subject Name</th>
                  <th>Faculty</th>
                  <th>Credits</th>
                </tr>
              </thead>
              <tbody>
                {student.subjects.map((sub) => (
                  <tr key={sub.code}>
                    <td><span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{sub.code}</span></td>
                    <td className="font-medium text-slate-800">{sub.name}</td>
                    <td className="text-slate-500">{sub.faculty}</td>
                    <td className="text-center"><span className="badge-indigo">{sub.credits}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="card">
          <div className="card-header"><h2 className="card-title flex items-center gap-2"><FileText size={16} /> Uploaded Documents</h2></div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {student.documents.map((doc) => (
              <div key={doc.name} className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{doc.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{doc.type}</p>
                  </div>
                  <span className={getDocumentStatusBadge(doc.status)}>{doc.status}</span>
                </div>
                <p className="text-xs text-slate-400">Uploaded: {formatDate(doc.date)}</p>
                {doc.status === 'Uploaded' && (
                  <button className="btn-secondary btn-sm w-full justify-center">
                    <Download size={13} /> Download
                  </button>
                )}
                {doc.status === 'Pending' && (
                  <button className="btn-primary btn-sm w-full justify-center">Upload Document</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
