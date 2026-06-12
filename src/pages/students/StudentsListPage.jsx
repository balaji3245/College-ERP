import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlus, Eye, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../services/api';
import { useSearch } from '../../hooks/useSearch';
import { usePagination } from '../../hooks/usePagination';
import SearchInput from '../../components/ui/SearchInput';
import Pagination from '../../components/ui/Pagination';
import Avatar from '../../components/ui/Avatar';
import { getStudentStatusBadge, getFeeStatusBadge } from '../../utils/helpers';

export default function StudentsListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [deptFilter, setDeptFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [semFilter, setSemFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, deptsData] = await Promise.all([
          api.getStudents(),
          api.getDepartments()
        ]);
        setStudents(studentsData);
        setDepartments(deptsData);
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [updateTrigger]);

  const { query, setQuery, filtered: searchFiltered } = useSearch(students, ['fullName', 'id', 'rollNumber', 'email', 'departmentName', 'courseName']);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setQuery(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    return searchFiltered.filter((s) => {
      if (deptFilter && s.departmentId !== deptFilter) return false;
      if (courseFilter && s.courseId !== courseFilter) return false;
      if (semFilter && String(s.semester) !== semFilter) return false;
      if (statusFilter && s.status !== statusFilter) return false;
      return true;
    });
  }, [searchFiltered, deptFilter, courseFilter, semFilter, statusFilter]);

  const { currentPage, totalPages, paginated, goToPage, reset, total } = usePagination(filtered, 12);

  useEffect(() => { reset(); }, [query, deptFilter, courseFilter, semFilter, statusFilter]);

  const colors = ['6366f1', '0ea5e9', '10b981', 'f59e0b', 'ef4444', '8b5cf6', '14b8a6', 'f97316'];

  const handleDelete = async () => {
    try {
      await api.deleteStudent(showDeleteModal);
      toast.success('Student deleted successfully');
      setUpdateTrigger((prev) => prev + 1);
    } catch (error) {
      toast.error('Failed to delete student');
    }
    setShowDeleteModal(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">{total} students found</p>
        </div>
        <button onClick={() => navigate('/students/add')} className="btn-primary">
          <UserPlus size={16} />
          Add Student
        </button>
      </div>

      <div className="card">
        <div className="p-3 sm:p-4 border-b border-slate-200 flex flex-wrap gap-2 sm:gap-3 items-center">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search by name, ID, roll number..."
            className="w-full sm:flex-1 sm:min-w-48"
          />
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="select flex-1 sm:flex-none sm:w-auto text-xs sm:text-sm">
              <option value="">All Depts</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.shortName}</option>)}
            </select>
            <select value={semFilter} onChange={(e) => setSemFilter(e.target.value)} className="select flex-1 sm:flex-none sm:w-auto text-xs sm:text-sm">
              <option value="">All Sem</option>
              {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Sem {s}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select flex-1 sm:flex-none sm:w-auto text-xs sm:text-sm">
              <option value="">Status</option>
              {['Active','Inactive','Alumni'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {(deptFilter || courseFilter || semFilter || statusFilter || query) && (
              <button
                onClick={() => { setDeptFilter(''); setCourseFilter(''); setSemFilter(''); setStatusFilter(''); setQuery(''); }}
                className="btn-ghost btn-sm text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No.</th>
                <th>Department</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Attendance</th>
                <th>Fee Status</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400">Loading students...</td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400">No students found matching your criteria.</td>
                </tr>
              ) : (
                paginated.map((student, idx) => (
                  <tr key={student.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar name={student.fullName} size="sm" color={colors[parseInt(student.id.replace('STU', '')) % colors.length]} />
                        <div>
                          <p className="font-medium text-slate-800">{student.fullName}</p>
                          <p className="text-xs text-slate-400">{student.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-xs text-slate-600">{student.rollNumber}</td>
                    <td>
                      <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {student.departmentId.replace('D', '')} - {student.departmentName.split(' ')[0]}
                      </span>
                    </td>
                    <td className="text-slate-600 text-sm">{student.courseName}</td>
                    <td className="text-center">
                      <span className="text-sm font-medium text-slate-700">Sem {student.semester}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${student.attendancePercentage >= 75 ? 'bg-green-500' : 'bg-red-400'}`}
                            style={{ width: `${student.attendancePercentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600">{student.attendancePercentage}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={getFeeStatusBadge(student.feeStatus)}>
                        {student.feeStatus}
                      </span>
                    </td>
                    <td>
                      <span className={getStudentStatusBadge(student.status)}>{student.status}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate(`/students/${student.id}`)}
                          className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(student.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} total={total} pageSize={12} />
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Delete Student</h3>
            <p className="text-sm text-slate-500 mb-6">Are you sure you want to delete student <strong>{showDeleteModal}</strong>? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteModal(null)} className="btn-secondary">Cancel</button>
              <button onClick={handleDelete} className="btn-danger">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
