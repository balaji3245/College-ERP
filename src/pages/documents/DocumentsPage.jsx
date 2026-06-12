import { useState, useEffect, useMemo } from 'react';
import { Download, FileText, Upload, CheckCircle, Clock } from 'lucide-react';
import { api } from '../../services/api';
import SearchInput from '../../components/ui/SearchInput';
import { getDocumentStatusBadge, formatDate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ALL_DOC_TYPES = [
  'Aadhaar Card',
  '10th Marksheet',
  '12th Marksheet',
  'Transfer Certificate',
  'Profile Photo',
  'Character Certificate',
  'Medical Certificate',
];

export default function DocumentsPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'Student' || user?.role === 'Parent';

  const [query, setQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stu, doc] = await Promise.all([
          api.getStudents(),
          api.getDocuments()
        ]);
        
        // Enrich students with documents
        const enriched = stu.map(s => {
          const sDocs = doc.filter(d => d.studentId === s.id);
          return {
            ...s,
            fullName: s.firstName ? `${s.firstName} ${s.lastName}` : 'Unknown Student',
            documents: sDocs
          };
        });

        setStudents(enriched);
        
        if (isStudent) {
          const myProfile = enriched.find(s => s.id === user?.linkedId) || enriched[0];
          setSelectedStudent(myProfile);
        }
      } catch (err) {
        toast.error('Failed to fetch documents');
      }
    };
    fetchData();
  }, [isStudent, user]);

  const matchedStudents = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return students
      .filter((s) => s.fullName.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q) || s.id.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query]);

  const recentStudentsWithDocs = students.slice(0, 12);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isStudent ? 'My Documents' : 'Documents'}</h1>
          <p className="page-subtitle">
            {isStudent
              ? `Document repository for ${selectedStudent?.fullName}`
              : 'Manage and view student documents'}
          </p>
        </div>
      </div>

      {/* Admin search bar */}
      {!isStudent && (
        <div className="card p-5">
          <label className="label">Search Student</label>
          <div className="max-w-md relative">
            <SearchInput value={query} onChange={(v) => { setQuery(v); setSelectedStudent(null); }} placeholder="Search by name, ID, or roll number..." />
            {matchedStudents.length > 0 && !selectedStudent && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-10">
                {matchedStudents.map((s) => (
                  <button key={s.id} onClick={() => { setSelectedStudent(s); setQuery(s.fullName); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0">
                    <p className="text-sm font-medium text-slate-800">{s.fullName}</p>
                    <p className="text-xs text-slate-400">{s.rollNumber} · {s.departmentName}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Document upload/view for selected student */}
      {selectedStudent && (
        <>
          {/* Summary Bar */}
          <div className="card p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-primary-600">{selectedStudent.fullName.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{selectedStudent.fullName}</h3>
                  <p className="text-sm text-slate-500">{selectedStudent.rollNumber} · {selectedStudent.departmentName}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-center px-4 py-2 bg-green-50 rounded-lg">
                  <p className="text-xl font-bold text-green-600">{selectedStudent.documents.filter(d => d.status === 'Uploaded').length}</p>
                  <p className="text-xs text-slate-500">Uploaded</p>
                </div>
                <div className="text-center px-4 py-2 bg-orange-50 rounded-lg">
                  <p className="text-xl font-bold text-orange-600">{ALL_DOC_TYPES.length - selectedStudent.documents.filter(d => d.status === 'Uploaded').length}</p>
                  <p className="text-xs text-slate-500">Pending</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Documents</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {ALL_DOC_TYPES.map((docName) => {
                const doc = selectedStudent.documents.find(d => d.name === docName);
                const uploaded = doc?.status === 'Uploaded';
                return (
                  <div key={docName} className={`border-2 rounded-xl p-4 flex flex-col gap-3 transition-colors ${uploaded ? 'border-green-200 bg-green-50/30' : 'border-dashed border-slate-200 hover:border-primary-300'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${uploaded ? 'bg-green-100' : 'bg-slate-100'}`}>
                          {uploaded
                            ? <CheckCircle size={16} className="text-green-600" />
                            : <FileText size={16} className="text-slate-400" />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{docName}</p>
                          <p className="text-xs text-slate-400">{uploaded ? `Uploaded: ${formatDate(doc.date)}` : 'PDF, JPG, PNG (max 5MB)'}</p>
                        </div>
                      </div>
                      <span className={getDocumentStatusBadge(uploaded ? 'Uploaded' : 'Pending')}>{uploaded ? 'Uploaded' : 'Pending'}</span>
                    </div>
                    {uploaded ? (
                      <button onClick={() => toast.success(`Downloading ${docName}...`)} className="btn-secondary btn-sm w-full justify-center">
                        <Download size={13} /> Download
                      </button>
                    ) : (
                      <button onClick={() => toast.success(`${docName} upload dialog will open...`)} className="btn-primary btn-sm w-full justify-center">
                        <Upload size={13} /> Upload Now
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {!isStudent && (
            <div className="flex justify-end mt-2">
              <button onClick={() => { setSelectedStudent(null); setQuery(''); }} className="btn-secondary">
                Search Another Student
              </button>
            </div>
          )}
        </>
      )}

      {/* Admin: no student selected → show list */}
      {!isStudent && !selectedStudent && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Student Documents</h2>
            <p className="text-xs text-slate-400 mt-0.5">Showing latest 12 students</p>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th><th>Department</th><th>Aadhaar</th><th>10th</th><th>12th</th><th>TC</th><th>Photo</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentStudentsWithDocs.map((student) => {
                  const docMap = {};
                  student.documents.forEach(d => { docMap[d.name] = d.status; });
                  return (
                    <tr key={student.id}>
                      <td>
                        <div>
                          <p className="font-medium text-slate-800">{student.fullName}</p>
                          <p className="text-xs text-slate-400">{student.rollNumber}</p>
                        </div>
                      </td>
                      <td className="text-sm text-slate-600">{(student.departmentName || 'N/A').split(' ')[0]}</td>
                      {['Aadhaar Card', '10th Marksheet', '12th Marksheet', 'Transfer Certificate', 'Profile Photo'].map((docName) => (
                        <td key={docName}>
                          <span className={getDocumentStatusBadge(docMap[docName] || 'Pending')}>{docMap[docName] || 'Pending'}</span>
                        </td>
                      ))}
                      <td>
                        <button onClick={() => { setSelectedStudent(student); setQuery(student.fullName); }} className="btn-ghost btn-sm">View</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
