import { useState, useEffect, useMemo } from 'react';
import { Award, TrendingUp, Download, Printer } from 'lucide-react';
import { api } from '../../services/api';
import SearchInput from '../../components/ui/SearchInput';
import BarChartWidget from '../../components/charts/BarChartWidget';
import { getGradeBadge } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function ResultsPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'Student' || user?.role === 'Parent';

  // If student/parent, auto-load their own result
  const initialId = isStudent ? user?.mockId : null;
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(initialId);
  const [resultsData, setResultsData] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res, stu] = await Promise.all([
          api.getResults(),
          api.getStudents()
        ]);
        
        // Group flat result records by student
        const grouped = {};
        res.forEach(record => {
          if (!grouped[record.studentId]) {
            grouped[record.studentId] = {
              studentId: record.studentId,
              semester: record.semester,
              academicYear: record.academicYear || '2024-2025',
              subjects: [],
              totalMarks: 0,
              gpa: 0,
              result: 'PASS',
              earnedCredits: 0,
              totalCredits: 0
            };
          }
          grouped[record.studentId].subjects.push({
            subject: record.subject,
            internal: record.internalMarks,
            external: record.externalMarks,
            total: record.totalMarks,
            grade: record.grade || 'C',
            gradePoint: record.totalMarks >= 90 ? 10 : record.totalMarks >= 80 ? 9 : record.totalMarks >= 70 ? 8 : record.totalMarks >= 60 ? 7 : 0
          });
          grouped[record.studentId].totalMarks += record.totalMarks;
        });

        // Enrich with student details
        const enriched = Object.values(grouped).map(g => {
          const s = stu.find(st => st.id === g.studentId) || {};
          return {
            ...g,
            studentName: s.firstName ? `${s.firstName} ${s.lastName}` : 'Unknown Student',
            rollNumber: s.rollNumber || 'N/A',
            departmentName: s.departmentId || 'Unknown',
            courseName: s.courseId || 'Unknown',
            gpa: (g.totalMarks / (g.subjects.length * 100) * 10).toFixed(1),
            result: g.subjects.some(sub => sub.total < 40) ? 'FAIL' : 'PASS',
            totalCredits: g.subjects.length * 4,
            earnedCredits: g.subjects.filter(sub => sub.total >= 40).length * 4
          };
        });

        setResultsData(enriched);
        setStudents(stu);
      } catch (err) {
        toast.error('Failed to fetch results');
      }
    };
    fetchData();
  }, []);

  const matchedStudents = useMemo(() => {
    if (isStudent) return [];
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return resultsData
      .filter((r) => r.studentName.toLowerCase().includes(q) || r.rollNumber.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, isStudent, resultsData]);

  const selectedResult = resultsData.find((r) => r.studentId === selectedId);

  const chartData = selectedResult
    ? selectedResult.subjects.map((s) => ({ subject: s.subject.slice(0, 12), marks: s.total }))
    : [];

  const passingSubjects = selectedResult?.subjects.filter(s => s.total >= 40).length || 0;
  const totalSubjects = selectedResult?.subjects.length || 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isStudent ? (user?.role === 'Parent' ? "Child's Results" : 'My Results') : 'Results'}</h1>
          <p className="page-subtitle">
            {isStudent
              ? `Semester-wise academic performance of ${selectedResult?.studentName || ''}`
              : 'View semester-wise academic results'}
          </p>
        </div>
        {selectedResult && (
          <button onClick={() => toast.success('Marksheet downloading...')} className="btn-secondary hidden sm:flex">
            <Download size={15} /> Download Marksheet
          </button>
        )}
      </div>

      {!isStudent && (
        <div className="card p-6 mb-4">
          <div className="max-w-lg">
            <label className="label">Search Student by Name or Roll Number</label>
            <SearchInput value={query} onChange={setQuery} placeholder="Type to search..." />
          </div>
          {matchedStudents.length > 0 && !selectedId && (
            <div className="mt-3 border border-slate-200 rounded-xl overflow-hidden max-w-lg">
              {matchedStudents.map((r) => (
                <button
                  key={r.studentId}
                  onClick={() => { setSelectedId(r.studentId); setQuery(r.studentName); }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0"
                >
                  <p className="text-sm font-medium text-slate-800">{r.studentName}</p>
                  <p className="text-xs text-slate-400">{r.rollNumber} · {r.departmentName}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedResult && (
        <>
          {/* Student Info Banner */}
          <div className="card p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{selectedResult.studentName}</h2>
              <p className="text-slate-500 text-sm mt-0.5">{selectedResult.rollNumber} · {selectedResult.departmentName} · {selectedResult.courseName}</p>
              <p className="text-slate-400 text-sm">Semester {selectedResult.semester} · {selectedResult.academicYear}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">{selectedResult.gpa}</p>
                <p className="text-xs text-slate-400">GPA</p>
              </div>
              <div className="w-px bg-slate-200 h-10 hidden sm:block" />
              <div className="text-center">
                <p className={`text-xl font-bold ${selectedResult.result === 'PASS' ? 'text-green-600' : 'text-red-500'}`}>{selectedResult.result}</p>
                <p className="text-xs text-slate-400">Result</p>
              </div>
              <div className="w-px bg-slate-200 h-10 hidden sm:block" />
              <div className="text-center">
                <p className="text-xl font-bold text-slate-800">{selectedResult.earnedCredits}/{selectedResult.totalCredits}</p>
                <p className="text-xs text-slate-400">Credits</p>
              </div>
              <div className="w-px bg-slate-200 h-10 hidden sm:block" />
              <div className="text-center">
                <p className="text-xl font-bold text-slate-800">{passingSubjects}/{totalSubjects}</p>
                <p className="text-xs text-slate-400">Passed</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="card">
              <div className="card-header"><h2 className="card-title">Subject-wise Marks</h2></div>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th className="text-center">Internal (30)</th>
                      <th className="text-center">External (70)</th>
                      <th className="text-center">Total (100)</th>
                      <th className="text-center">Grade</th>
                      <th className="text-center">GP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedResult.subjects.map((sub) => (
                      <tr key={sub.subject}>
                        <td className="font-medium text-slate-800">{sub.subject}</td>
                        <td className="text-center text-slate-600">{sub.internal}</td>
                        <td className="text-center text-slate-600">{sub.external}</td>
                        <td className={`text-center font-semibold ${sub.total < 40 ? 'text-red-600' : 'text-slate-800'}`}>{sub.total}</td>
                        <td className="text-center"><span className={getGradeBadge(sub.grade)}>{sub.grade}</span></td>
                        <td className="text-center text-sm font-medium text-slate-700">{sub.gradePoint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h2 className="card-title flex items-center gap-2"><TrendingUp size={16} />Performance Chart</h2></div>
              <div className="p-6">
                <BarChartWidget data={chartData} xKey="subject" bars={[{ key: 'marks', name: 'Marks', color: '#6366f1' }]} />
              </div>
              {/* Grade Legend */}
              <div className="px-6 pb-6 grid grid-cols-4 gap-2 text-center">
                {[['O', 'bg-purple-100 text-purple-700', '91-100'], ['A+', 'bg-indigo-100 text-indigo-700', '81-90'], ['A', 'bg-blue-100 text-blue-700', '71-80'], ['B+', 'bg-green-100 text-green-700', '61-70']].map(([grade, cls, range]) => (
                  <div key={grade} className={`${cls} rounded-lg p-2`}>
                    <p className="font-bold text-sm">{grade}</p>
                    <p className="text-[10px] opacity-75">{range}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {!isStudent && (
            <div className="flex justify-end mt-4">
              <button onClick={() => setSelectedId(null)} className="btn-secondary">
                Search Another Student
              </button>
            </div>
          )}
        </>
      )}

      {!selectedResult && !isStudent && !query && (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award size={28} className="text-slate-400" />
          </div>
          <p className="text-base font-semibold text-slate-700">Search for a student</p>
          <p className="text-sm text-slate-400 mt-1">Enter student name or roll number above to view their results</p>
        </div>
      )}
    </div>
  );
}
