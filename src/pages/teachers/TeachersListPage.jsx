import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Eye, Mail, Phone, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../services/api';
import { useSearch } from '../../hooks/useSearch';
import { usePagination } from '../../hooks/usePagination';
import SearchInput from '../../components/ui/SearchInput';
import Pagination from '../../components/ui/Pagination';
import Avatar from '../../components/ui/Avatar';

const DESIGNATIONS = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Senior Lecturer',
  'Lecturer',
];

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '', phone: '',
  departmentId: '', designation: '', qualification: '',
  specialization: '', experience: '', joiningDate: '', status: 'Active',
};

function AddTeacherModal({ open, onClose, onSave, departments }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(EMPTY_FORM);
  }, [open]);

  if (!open) return null;

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      toast.error('First name, last name, and email are required');
      return;
    }
    if (!form.departmentId) {
      toast.error('Please select a department');
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <h2 className="text-lg font-bold text-slate-800">Add New Teacher</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="p-6 space-y-5">
            {/* Personal Info */}
            <div>
              <p className="section-title mb-3">Personal Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="label">First Name <span className="text-red-500">*</span></label>
                  <input className="input" placeholder="e.g. Rahul" value={form.firstName} onChange={e => update('firstName', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="label">Last Name <span className="text-red-500">*</span></label>
                  <input className="input" placeholder="e.g. Verma" value={form.lastName} onChange={e => update('lastName', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="label">Email Address <span className="text-red-500">*</span></label>
                  <input type="email" className="input" placeholder="e.g. rahul.verma@college.edu" value={form.email} onChange={e => update('email', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="label">Phone Number</label>
                  <input className="input" placeholder="e.g. 9876543210" value={form.phone} onChange={e => update('phone', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="divider" />

            {/* Academic Info */}
            <div>
              <p className="section-title mb-3">Academic Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="label">Department <span className="text-red-500">*</span></label>
                  <select className="select" value={form.departmentId} onChange={e => update('departmentId', e.target.value)} required>
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Designation <span className="text-red-500">*</span></label>
                  <select className="select" value={form.designation} onChange={e => update('designation', e.target.value)} required>
                    <option value="">Select Designation</option>
                    {DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Qualification</label>
                  <input className="input" placeholder="e.g. Ph.D. Computer Science" value={form.qualification} onChange={e => update('qualification', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="label">Specialization</label>
                  <input className="input" placeholder="e.g. Machine Learning" value={form.specialization} onChange={e => update('specialization', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="label">Experience (Years)</label>
                  <input type="number" min="0" max="50" className="input" placeholder="e.g. 5" value={form.experience} onChange={e => update('experience', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="label">Joining Date</label>
                  <input type="date" className="input" value={form.joiningDate} onChange={e => update('joiningDate', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="label">Status</label>
                  <select className="select" value={form.status} onChange={e => update('status', e.target.value)}>
                    <option>Active</option>
                    <option>On Leave</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 flex gap-3 justify-end flex-shrink-0">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              <UserPlus size={15} /> {saving ? 'Adding...' : 'Add Teacher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TeachersListPage() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deptFilter, setDeptFilter] = useState('');
  const [desigFilter, setDesigFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTeacherId, setDeleteTeacherId] = useState(null);

  const fetchData = async () => {
    try {
      const [teachersData, deptsData] = await Promise.all([
        api.getTeachers(),
        api.getDepartments()
      ]);
      setTeachers(teachersData);
      setDepartments(deptsData);
    } catch (err) {
      toast.error('Failed to fetch teachers data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const { query, setQuery, filtered: searchFiltered } = useSearch(
    teachers, ['fullName', 'id', 'email', 'departmentName', 'designation', 'specialization']
  );

  const filtered = useMemo(() => {
    return searchFiltered.filter((t) => {
      if (deptFilter && t.departmentId !== deptFilter) return false;
      if (desigFilter && t.designation !== desigFilter) return false;
      return true;
    });
  }, [searchFiltered, deptFilter, desigFilter]);

  const { currentPage, totalPages, paginated, goToPage, total } = usePagination(filtered, 12);

  const colors = ['6366f1', '0ea5e9', '10b981', 'f59e0b', 'ef4444', '8b5cf6', '14b8a6', 'f97316'];

  const handleAddTeacher = async (form) => {
    await api.addTeacher(form);
    toast.success(`Teacher ${form.firstName} ${form.lastName} added successfully!`);
    fetchData();
  };

  const handleDelete = async () => {
    try {
      await api.deleteTeacher(deleteTeacherId);
      toast.success('Teacher deleted successfully');
      setDeleteTeacherId(null);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Teachers</h1>
          <p className="page-subtitle">{total} faculty members</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <UserPlus size={16} /> Add Teacher
        </button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-slate-200 flex flex-wrap gap-3">
          <SearchInput value={query} onChange={setQuery} placeholder="Search by name, ID, subject..." className="flex-1 min-w-48" />
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="select w-auto">
            <option value="">All Departments</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.shortName}</option>)}
          </select>
          <select value={desigFilter} onChange={(e) => setDesigFilter(e.target.value)} className="select w-auto">
            <option value="">All Designations</option>
            {DESIGNATIONS.map((d) => <option key={d}>{d}</option>)}
          </select>
          {(deptFilter || desigFilter || query) && (
            <button
              onClick={() => { setDeptFilter(''); setDesigFilter(''); setQuery(''); }}
              className="btn-ghost btn-sm text-xs"
            >
              Clear
            </button>
          )}
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Employee ID</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-10 text-slate-400">Loading teachers...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-slate-400">No teachers found.</td></tr>
              ) : (
                paginated.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar name={teacher.fullName} size="sm" color={colors[parseInt((teacher.id || 'T1').replace(/\D/g, '') || '1') % colors.length]} />
                        <div>
                          <p className="font-medium text-slate-800">{teacher.fullName}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1"><Mail size={10} />{teacher.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-xs text-slate-600">{teacher.employeeId}</td>
                    <td><span className="text-sm text-slate-700">{teacher.designation}</span></td>
                    <td>
                      <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {(teacher.departmentName || 'N/A').split(' ')[0]}
                      </span>
                    </td>
                    <td className="text-slate-500 text-sm">{teacher.specialization || 'N/A'}</td>
                    <td className="text-center">
                      <span className="text-sm font-medium text-slate-700">{teacher.experience || 0} yrs</span>
                    </td>
                    <td>
                      <span className={teacher.status === 'Active' ? 'badge-green' : 'badge-yellow'}>
                        {teacher.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate(`/teachers/${teacher.id}`)}
                          className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTeacherId(teacher.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Teacher"
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

      {/* Add Teacher Modal */}
      <AddTeacherModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddTeacher}
        departments={departments}
      />

      {/* Delete Confirm Modal */}
      {deleteTeacherId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Delete Teacher</h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete teacher <strong>{deleteTeacherId}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteTeacherId(null)} className="btn-secondary">Cancel</button>
              <button onClick={handleDelete} className="btn-danger">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
