import { useState, useEffect, useMemo } from 'react';
import { BookOpen, Clock, Users, GraduationCap } from 'lucide-react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import SearchInput from '../../components/ui/SearchInput';
import { useSearch } from '../../hooks/useSearch';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deptFilter, setDeptFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, deptsData] = await Promise.all([
          api.getCourses(),
          api.getDepartments()
        ]);
        setCourses(coursesData);
        setDepartments(deptsData);
      } catch (err) {
        toast.error('Failed to fetch courses data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const { query, setQuery, filtered: searchFiltered } = useSearch(courses, ['name', 'shortName', 'departmentName']);

  const filtered = useMemo(() => {
    return searchFiltered.filter((c) => {
      if (deptFilter && c.departmentId !== deptFilter) return false;
      if (typeFilter && c.type !== typeFilter) return false;
      return true;
    });
  }, [searchFiltered, deptFilter, typeFilter]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Courses</h1>
          <p className="page-subtitle">{filtered.length} courses available</p>
        </div>
        <button className="btn-primary" onClick={() => toast.success('Add Course form will open here')}>Add Course</button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-slate-200 flex flex-wrap gap-3">
          <SearchInput value={query} onChange={setQuery} placeholder="Search courses..." className="flex-1 min-w-48" />
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="select w-auto">
            <option value="">All Departments</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.shortName}</option>)}
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="select w-auto">
            <option value="">UG & PG</option>
            <option value="UG">Undergraduate</option>
            <option value="PG">Postgraduate</option>
          </select>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Short Name</th>
                <th>Department</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Semesters</th>
                <th>Total Seats</th>
                <th>Annual Fees</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-10 text-slate-400">Loading courses...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-slate-400">No courses found.</td></tr>
              ) : filtered.map((course) => (
                <tr key={course.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen size={14} className="text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{course.name}</p>
                        <p className="text-xs text-slate-400">{course.id}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{course.shortName || course.id}</span></td>
                  <td className="text-sm text-slate-600">{(course.departmentName || 'N/A')?.split(' ')[0]}</td>
                  <td>
                    <span className={course.type === 'UG' ? 'badge-blue' : course.type === 'PG' ? 'badge-purple' : 'badge-blue'}>{course.type || 'UG'}</span>
                  </td>
                  <td className="text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400" />
                      {course.duration || 'N/A'}
                    </div>
                  </td>
                  <td className="text-center">
                    <span className="text-sm font-medium text-slate-700">{course.semesters}</span>
                  </td>
                  <td className="text-center">
                    <div className="flex items-center gap-1.5 justify-center">
                      <Users size={13} className="text-slate-400" />
                      {course.totalSeats}
                    </div>
                  </td>
                  <td className="font-medium text-slate-700">₹{(course.fees || 0).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
