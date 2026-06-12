import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, BookOpen, MapPin, Mail, Phone, Plus, X, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../services/api';

const colorVariants = {
  blue:   { card: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700',   },
  indigo: { card: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700'},
  yellow: { card: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700'},
  orange: { card: 'border-orange-200', badge: 'bg-orange-100 text-orange-700'},
  green:  { card: 'border-green-200',  badge: 'bg-green-100 text-green-700'  },
  purple: { card: 'border-purple-200', badge: 'bg-purple-100 text-purple-700'},
  red:    { card: 'border-red-200',    badge: 'bg-red-100 text-red-700'      },
  teal:   { card: 'border-teal-200',   badge: 'bg-teal-100 text-teal-700'   },
};

const EMPTY_FORM = { name: '', shortName: '', hod: '', established: '', description: '' };

function DeptModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(initial || EMPTY_FORM);
  }, [open, initial]);

  if (!open) return null;

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.shortName.trim()) {
      toast.error('Department name and short name are required');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            {initial ? 'Edit Department' : 'Add New Department'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 form-group">
              <label className="label">Department Name <span className="text-red-500">*</span></label>
              <input
                className="input"
                placeholder="e.g. Computer Science & Engineering"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="label">Short Name <span className="text-red-500">*</span></label>
              <input
                className="input"
                placeholder="e.g. CSE"
                value={form.shortName}
                onChange={e => update('shortName', e.target.value.toUpperCase())}
                maxLength={10}
                required
              />
            </div>
            <div className="form-group">
              <label className="label">Established Year</label>
              <input
                className="input"
                placeholder="e.g. 2000"
                value={form.established}
                onChange={e => update('established', e.target.value)}
                maxLength={4}
              />
            </div>
            <div className="col-span-2 form-group">
              <label className="label">Head of Department (HOD)</label>
              <input
                className="input"
                placeholder="e.g. Dr. John Smith"
                value={form.hod}
                onChange={e => update('hod', e.target.value)}
              />
            </div>
            <div className="col-span-2 form-group">
              <label className="label">Description</label>
              <textarea
                className="input resize-none"
                rows={3}
                placeholder="Brief description of the department..."
                value={form.description}
                onChange={e => update('description', e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : (initial ? 'Update Department' : 'Add Department')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ open, onClose, onConfirm, deptName }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Delete Department</h3>
        <p className="text-sm text-slate-500 mb-6">
          Are you sure you want to delete <strong>{deptName}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={onConfirm} className="btn-danger">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function DepartmentsPage() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [deleteDept, setDeleteDept] = useState(null);

  const fetchDepartments = async () => {
    try {
      const data = await api.getDepartments();
      setDepartments(data);
    } catch (err) {
      toast.error('Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const handleAdd = async (form) => {
    await api.addDepartment(form);
    toast.success(`Department "${form.name}" added successfully!`);
    fetchDepartments();
  };

  const handleEdit = async (form) => {
    await api.updateDepartment(editDept.id, form);
    toast.success('Department updated successfully!');
    setEditDept(null);
    fetchDepartments();
  };

  const handleDelete = async () => {
    try {
      await api.deleteDepartment(deleteDept.id);
      toast.success('Department deleted successfully!');
      setDeleteDept(null);
      fetchDepartments();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">{loading ? '...' : departments.length} academic departments</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {loading ? (
          <p className="text-slate-500">Loading departments...</p>
        ) : departments.length === 0 ? (
          <p className="text-slate-500">No departments found.</p>
        ) : departments.map((dept) => {
          const cv = colorVariants[dept.color] || colorVariants.indigo;
          return (
            <div
              key={dept.id}
              className={`card border-l-4 ${cv.card} hover:shadow-md transition-shadow`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">{dept.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Est. {dept.established}</p>
                  </div>
                  <span className={`${cv.badge} text-xs font-bold px-2.5 py-1 rounded-full`}>{dept.shortName}</span>
                </div>

                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{dept.description}</p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Students', value: dept.totalStudents || 0, icon: GraduationCap },
                    { label: 'Faculty',  value: dept.totalFaculty  || 0, icon: Users },
                    { label: 'Courses',  value: dept.totalCourses  || 0, icon: BookOpen },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-slate-50 rounded-lg p-2.5 text-center">
                      <p className="text-lg font-bold text-slate-800">{value}</p>
                      <p className="text-xs text-slate-400">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="divider mb-3" />

                <div className="space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Users size={12} />
                    <span>Head: <span className="font-medium text-slate-700">{dept.hod || 'N/A'}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} />
                    <span>Campus Area</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail size={12} />
                    <span>{(dept.shortName || 'dept').toLowerCase()}@college.edu</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone size={12} />
                    <span>+91 98765 43210</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/students?dept=${dept.id}`)}
                    className="btn-secondary btn-sm flex-1 justify-center"
                  >
                    View Students
                  </button>
                  <button
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Department"
                    onClick={() => setEditDept({ id: dept.id, ...dept })}
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Department"
                    onClick={() => setDeleteDept(dept)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      <DeptModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAdd}
        initial={null}
      />

      {/* Edit Modal */}
      <DeptModal
        open={!!editDept}
        onClose={() => setEditDept(null)}
        onSave={handleEdit}
        initial={editDept ? {
          name: editDept.name,
          shortName: editDept.shortName,
          hod: editDept.hod || '',
          established: editDept.established || '',
          description: editDept.description || '',
        } : null}
      />

      {/* Delete Confirm */}
      <DeleteConfirmModal
        open={!!deleteDept}
        onClose={() => setDeleteDept(null)}
        onConfirm={handleDelete}
        deptName={deleteDept?.name}
      />
    </div>
  );
}
