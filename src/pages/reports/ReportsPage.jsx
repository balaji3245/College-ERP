import { useState, useEffect } from 'react';
import { Download, FileBarChart2, Users, CalendarCheck, CreditCard, GraduationCap, TrendingUp } from 'lucide-react';
import BarChartWidget from '../../components/charts/BarChartWidget';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { api } from '../../services/api';

const reportTypes = [
  { id: 'student', label: 'Student Report', icon: Users, description: 'Department-wise student statistics' },
  { id: 'attendance', label: 'Attendance Report', icon: CalendarCheck, description: 'Monthly attendance summaries' },
  { id: 'fee', label: 'Fee Report', icon: CreditCard, description: 'Fee collection and dues analysis' },
  { id: 'academic', label: 'Academic Report', icon: GraduationCap, description: 'Results and performance analytics' },
];

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState('student');
  const [reportData, setReportData] = useState([]);
  const [deptFilter, setDeptFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('2024-2025');

  useEffect(() => {
    api.getReportAnalytics(activeReport).then(setReportData).catch(console.error);
  }, [activeReport]);

  const filteredData = deptFilter
    ? reportData.filter(r => r.department === deptFilter)
    : reportData;

  const feeChartData = reportData.map(r => ({
    department: r.department,
    Collected: Math.round(r.collected / 100000),
    Pending: Math.round(r.pending / 100000),
  }));

  const academicChartData = reportData.map(r => ({
    department: r.department,
    'Avg GPA': r.avgGpa,
  }));

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Generate and export institutional reports</p>
        </div>
        <button className="btn-primary" onClick={() => toast.success('Generating PDF report...')}>
          <Download size={15} /> Export PDF
        </button>
      </div>

      {/* Report type selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {reportTypes.map((rt) => (
          <button
            key={rt.id}
            onClick={() => setActiveReport(rt.id)}
            className={`card p-4 text-left transition-all ${activeReport === rt.id ? 'border-primary-400 bg-primary-50' : 'hover:border-slate-300'}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${activeReport === rt.id ? 'bg-primary-100' : 'bg-slate-100'}`}>
              <rt.icon size={18} className={activeReport === rt.id ? 'text-primary-600' : 'text-slate-500'} />
            </div>
            <p className={`text-sm font-semibold ${activeReport === rt.id ? 'text-primary-700' : 'text-slate-800'}`}>{rt.label}</p>
            <p className="text-xs text-slate-400 mt-1">{rt.description}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-header flex flex-wrap gap-3 items-center justify-between">
          <div>
            <h2 className="card-title">{reportTypes.find(r => r.id === activeReport)?.label}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Academic Year: {yearFilter}</p>
          </div>
          <div className="flex gap-3">
            <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="select w-auto text-sm">
              {['2022-2023', '2023-2024', '2024-2025', '2025-2026'].map((y) => <option key={y}>{y}</option>)}
            </select>
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="select w-auto text-sm">
              <option value="">All Departments</option>
              {reportData.map(d => <option key={d.department} value={d.department}>{d.department}</option>)}
            </select>
            <button className="btn-secondary btn-sm" onClick={() => toast.success('Exporting report...')}>
              <Download size={13} /> Export
            </button>
          </div>
        </div>

        {/* ── STUDENT REPORT ── */}
        {activeReport === 'student' && (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th className="text-center">Total</th>
                    <th className="text-center">Active</th>
                    <th className="text-center">Inactive</th>
                    <th className="text-center">Male</th>
                    <th className="text-center">Female</th>
                    <th className="text-center">Active %</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row) => (
                    <tr key={row.department}>
                      <td className="font-semibold text-slate-800">{row.department}</td>
                      <td className="text-center font-bold text-slate-800">{row.total}</td>
                      <td className="text-center text-green-600 font-medium">{row.active}</td>
                      <td className="text-center text-red-500">{row.inactive}</td>
                      <td className="text-center text-slate-600">{row.male}</td>
                      <td className="text-center text-slate-600">{row.female}</td>
                      <td className="text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16 bg-slate-100 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${Math.round(row.active / (row.total || 1) * 100)}%` }} />
                          </div>
                          <span className="text-xs text-slate-600">{Math.round(row.active / (row.total || 1) * 100)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-semibold">
                    <td>Total</td>
                    <td className="text-center">{filteredData.reduce((a, r) => a + r.total, 0)}</td>
                    <td className="text-center text-green-600">{filteredData.reduce((a, r) => a + r.active, 0)}</td>
                    <td className="text-center text-red-500">{filteredData.reduce((a, r) => a + r.inactive, 0)}</td>
                    <td className="text-center">{filteredData.reduce((a, r) => a + r.male, 0)}</td>
                    <td className="text-center">{filteredData.reduce((a, r) => a + r.female, 0)}</td>
                    <td className="text-center">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── ATTENDANCE REPORT ── */}
        {activeReport === 'attendance' && (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th className="text-center">Jan</th>
                  <th className="text-center">Feb</th>
                  <th className="text-center">Mar</th>
                  <th className="text-center">Apr</th>
                  <th className="text-center">May</th>
                  <th className="text-center">Jun</th>
                  <th className="text-center">Avg</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => {
                  const months = [row.jan, row.feb, row.mar, row.apr, row.may, row.jun];
                  const avg = Math.round(months.reduce((a, b) => a + b, 0) / months.length);
                  return (
                    <tr key={row.department}>
                      <td className="font-semibold text-slate-800">{row.department}</td>
                      {months.map((v, i) => (
                        <td key={i} className={`text-center font-medium ${v >= 85 ? 'text-green-600' : v >= 75 ? 'text-yellow-600' : 'text-red-500'}`}>{v}%</td>
                      ))}
                      <td className="text-center font-bold text-slate-800">{avg}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── FEE REPORT ── */}
        {activeReport === 'fee' && (
          <>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">{formatCurrency(filteredData.reduce((a, r) => a + r.collected, 0))}</p>
                  <p className="text-sm text-slate-500 mt-1">Total Collected</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(filteredData.reduce((a, r) => a + r.pending, 0))}</p>
                  <p className="text-sm text-slate-500 mt-1">Total Pending</p>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-indigo-700">
                    {Math.round(filteredData.reduce((a, r) => a + r.collected, 0) / (filteredData.reduce((a, r) => a + r.totalFees, 0) || 1) * 100)}%
                  </p>
                  <p className="text-sm text-slate-500 mt-1">Collection Rate</p>
                </div>
              </div>
              <BarChartWidget
                data={feeChartData}
                xKey="department"
                bars={[
                  { key: 'Collected', name: 'Collected (₹ Lakhs)', color: '#10b981' },
                  { key: 'Pending', name: 'Pending (₹ Lakhs)', color: '#ef4444' },
                ]}
              />
            </div>
            <div className="table-container border-t border-slate-100">
              <table className="table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th className="text-center">Students</th>
                    <th className="text-right">Total Fees</th>
                    <th className="text-right">Collected</th>
                    <th className="text-right">Pending</th>
                    <th className="text-center">Collection %</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row) => (
                    <tr key={row.department}>
                      <td className="font-semibold text-slate-800">{row.department}</td>
                      <td className="text-center text-slate-600">{row.students}</td>
                      <td className="text-right font-medium text-slate-700">{formatCurrency(row.totalFees)}</td>
                      <td className="text-right font-medium text-green-600">{formatCurrency(row.collected)}</td>
                      <td className="text-right font-medium text-red-500">{formatCurrency(row.pending)}</td>
                      <td className="text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16 bg-slate-100 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${Math.round(row.collected / (row.totalFees || 1) * 100)}%` }} />
                          </div>
                          <span className="text-xs font-medium text-slate-700">{Math.round(row.collected / (row.totalFees || 1) * 100)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── ACADEMIC REPORT ── */}
        {activeReport === 'academic' && (
          <>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-indigo-700">
                    {filteredData.length > 0 ? (filteredData.reduce((a, r) => a + r.avgGpa, 0) / filteredData.length).toFixed(2) : '0.00'}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">College Avg GPA</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">
                    {filteredData.reduce((a, r) => a + r.totalStudents, 0) > 0 ? Math.round(filteredData.reduce((a, r) => a + r.passed, 0) / filteredData.reduce((a, r) => a + r.totalStudents, 0) * 100) : 0}%
                  </p>
                  <p className="text-sm text-slate-500 mt-1">Overall Pass Rate</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{filteredData.reduce((a, r) => a + r.failed, 0)}</p>
                  <p className="text-sm text-slate-500 mt-1">Total Failures</p>
                </div>
              </div>
              <BarChartWidget
                data={academicChartData}
                xKey="department"
                bars={[{ key: 'Avg GPA', name: 'Average GPA', color: '#6366f1' }]}
              />
            </div>
            <div className="table-container border-t border-slate-100">
              <table className="table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th className="text-center">Total Students</th>
                    <th className="text-center">Passed</th>
                    <th className="text-center">Failed</th>
                    <th className="text-center">Avg GPA</th>
                    <th className="text-center">Pass Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row) => (
                    <tr key={row.department}>
                      <td className="font-semibold text-slate-800">{row.department}</td>
                      <td className="text-center font-bold text-slate-700">{row.totalStudents}</td>
                      <td className="text-center text-green-600 font-medium">{row.passed}</td>
                      <td className="text-center text-red-500">{row.failed}</td>
                      <td className="text-center font-bold text-indigo-600">{row.avgGpa}</td>
                      <td className="text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16 bg-slate-100 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${row.passRate >= 95 ? 'bg-green-500' : row.passRate >= 90 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${row.passRate}%` }} />
                          </div>
                          <span className="text-xs font-medium text-slate-700">{row.passRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-semibold">
                    <td>Total</td>
                    <td className="text-center">{filteredData.reduce((a, r) => a + r.totalStudents, 0)}</td>
                    <td className="text-center text-green-600">{filteredData.reduce((a, r) => a + r.passed, 0)}</td>
                    <td className="text-center text-red-500">{filteredData.reduce((a, r) => a + r.failed, 0)}</td>
                    <td className="text-center text-indigo-600">
                      {filteredData.length > 0 ? (filteredData.reduce((a, r) => a + r.avgGpa, 0) / filteredData.length).toFixed(2) : '0.00'}
                    </td>
                    <td className="text-center">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
