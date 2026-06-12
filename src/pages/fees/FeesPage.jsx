import { useState, useEffect, useMemo } from 'react';
import { IndianRupee, TrendingUp, AlertCircle, CheckCircle, Download, CreditCard, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../services/api';
import { useSearch } from '../../hooks/useSearch';
import { usePagination } from '../../hooks/usePagination';
import SearchInput from '../../components/ui/SearchInput';
import Pagination from '../../components/ui/Pagination';
import BarChartWidget from '../../components/charts/BarChartWidget';
import { formatCurrency, getFeeStatusBadge } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

export default function FeesPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'Student' || user?.role === 'Parent';

  const [statusFilter, setStatusFilter] = useState('');
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feeMonthlyData, setFeeMonthlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feesData, stuData] = await Promise.all([
          api.getFees(),
          api.getStudents()
        ]);
        setFees(feesData);
        setStudents(stuData);
      } catch (err) {
        toast.error('Failed to fetch fee data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // Load monthly chart data from analytics
    api.getDashboardAnalytics().then(d => setFeeMonthlyData(d.feeCollectionByMonth || [])).catch(() => {});
  }, []);

  const enrichedFees = useMemo(() => {
    return fees.map(f => {
      const stu = students.find(s => s.id === f.studentId) || {};
      return {
        ...f,
        studentName: stu.firstName ? `${stu.firstName} ${stu.lastName}` : 'Unknown Student',
        rollNumber: stu.rollNumber || 'N/A',
        departmentName: stu.departmentId || 'N/A',
        courseName: stu.courseId || 'N/A',
        semester: stu.semester || 1,
        totalFees: f.amount || 0,
        paidAmount: f.paidAmount || 0,
        pendingAmount: (f.amount || 0) - (f.paidAmount || 0),
        feeStatus: f.status || 'Pending'
      };
    });
  }, [fees, students]);

  const { query, setQuery, filtered: searchFiltered } = useSearch(enrichedFees, ['studentName', 'rollNumber', 'studentId', 'departmentName', 'courseName']);

  // For student: show only their fee record
  const studentFee = isStudent ? enrichedFees.find(f => f.studentId === user?.linkedId) || enrichedFees[0] : null;

  const filtered = useMemo(() => {
    if (isStudent) return [];
    return searchFiltered.filter((f) => {
      if (statusFilter && f.feeStatus !== statusFilter) return false;
      return true;
    });
  }, [searchFiltered, statusFilter, isStudent]);

  const { currentPage, totalPages, paginated, goToPage, total } = usePagination(filtered, 12);

  const totals = useMemo(() => ({
    collected: enrichedFees.reduce((a, f) => a + f.paidAmount, 0),
    pending: enrichedFees.reduce((a, f) => a + f.pendingAmount, 0),
    total: enrichedFees.reduce((a, f) => a + f.totalFees, 0),
    paidCount: enrichedFees.filter(f => f.feeStatus === 'Paid').length,
    partialCount: enrichedFees.filter(f => f.feeStatus === 'Partial').length,
    unpaidCount: enrichedFees.filter(f => f.feeStatus === 'Unpaid' || f.feeStatus === 'Pending').length,
  }), [enrichedFees]);

  // ── STUDENT / PARENT VIEW ──────────────────────────────────────────────
  if (isStudent && studentFee) {
    const paidPct = Math.round((studentFee.paidAmount / studentFee.totalFees) * 100);
    const installments = [
      { label: 'First Installment', amount: studentFee.totalFees * 0.5, due: '2025-07-01', paid: studentFee.paidAmount >= studentFee.totalFees * 0.5 },
      { label: 'Second Installment', amount: studentFee.totalFees * 0.5, due: '2025-12-01', paid: studentFee.paidAmount >= studentFee.totalFees },
    ];

    return (
      <div className="page-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">{user?.role === 'Parent' ? "Child's Fees" : 'My Fees'}</h1>
            <p className="page-subtitle">Fee details for {studentFee.studentName}</p>
          </div>
          <button onClick={() => toast.success('Fee receipt downloading...')} className="btn-secondary hidden sm:flex">
            <Download size={15} /> Download Receipt
          </button>
        </div>

        {/* Fee Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="card p-5 border-l-4 border-indigo-400">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 rounded-xl"><IndianRupee size={20} className="text-indigo-600" /></div>
              <div>
                <p className="text-sm text-slate-500">Total Fees</p>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(studentFee.totalFees)}</p>
                <p className="text-xs text-slate-400 mt-0.5">{studentFee.courseName}</p>
              </div>
            </div>
          </div>
          <div className="card p-5 border-l-4 border-green-400">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-100 rounded-xl"><CheckCircle size={20} className="text-green-600" /></div>
              <div>
                <p className="text-sm text-slate-500">Amount Paid</p>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(studentFee.paidAmount)}</p>
                <p className="text-xs text-green-600 mt-0.5">{paidPct}% paid</p>
              </div>
            </div>
          </div>
          <div className="card p-5 border-l-4 border-red-400">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-100 rounded-xl"><AlertCircle size={20} className="text-red-500" /></div>
              <div>
                <p className="text-sm text-slate-500">Pending Amount</p>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(studentFee.pendingAmount)}</p>
                <p className="text-xs text-red-500 mt-0.5">Due: {studentFee.dueDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="card p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-slate-800">Payment Progress</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              studentFee.feeStatus === 'Paid' ? 'bg-green-100 text-green-700' :
              studentFee.feeStatus === 'Partial' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>{studentFee.feeStatus}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all ${paidPct >= 100 ? 'bg-green-500' : paidPct > 0 ? 'bg-yellow-500' : 'bg-red-400'}`}
              style={{ width: `${paidPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>Paid: {formatCurrency(studentFee.paidAmount)}</span>
            <span>Total: {formatCurrency(studentFee.totalFees)}</span>
          </div>
        </div>

        {/* Installments */}
        <div className="card mb-6">
          <div className="card-header"><h2 className="card-title flex items-center gap-2"><Calendar size={16} /> Installment Schedule</h2></div>
          <div className="p-0">
            {installments.map((inst, idx) => (
              <div key={idx} className="flex items-center justify-between p-5 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${inst.paid ? 'bg-green-100' : 'bg-slate-100'}`}>
                    {inst.paid ? <CheckCircle size={20} className="text-green-600" /> : <CreditCard size={20} className="text-slate-400" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{inst.label}</p>
                    <p className="text-xs text-slate-500">Due: {inst.due}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <p className="font-bold text-slate-800">{formatCurrency(inst.amount)}</p>
                  {inst.paid ? (
                    <span className="badge-green">Paid</span>
                  ) : (
                    <button onClick={() => toast.success('Redirecting to payment gateway...')} className="btn-primary btn-sm">Pay Now</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Breakdown */}
        <div className="card">
          <div className="card-header"><h2 className="card-title">Fee Breakdown</h2></div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Fee Component</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Tuition Fee', amount: studentFee.totalFees * 0.6 },
                  { label: 'Laboratory Charges', amount: studentFee.totalFees * 0.15 },
                  { label: 'Library Fee', amount: studentFee.totalFees * 0.05 },
                  { label: 'Sports & Activity Fee', amount: studentFee.totalFees * 0.05 },
                  { label: 'Exam Fee', amount: studentFee.totalFees * 0.1 },
                  { label: 'Development Fund', amount: studentFee.totalFees * 0.05 },
                ].map(({ label, amount }) => (
                  <tr key={label}>
                    <td className="text-slate-700">{label}</td>
                    <td className="text-right font-medium text-slate-800">{formatCurrency(amount)}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="text-slate-900">Total</td>
                  <td className="text-right text-slate-900">{formatCurrency(studentFee.totalFees)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ── ADMIN VIEW ────────────────────────────────────────────────────────
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Fees Management</h1>
          <p className="page-subtitle">Track fee payments and pending dues</p>
        </div>
        <button className="btn-secondary" onClick={() => toast.success('Exporting fee data...')}>
          <Download size={15} /> Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="card p-5 border-l-4 border-green-400">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-100 rounded-xl"><CheckCircle size={20} className="text-green-600" /></div>
            <div>
              <p className="text-sm text-slate-500">Total Collected</p>
              <p className="text-xl font-bold text-slate-800">{formatCurrency(totals.collected)}</p>
              <p className="text-xs text-green-600 mt-0.5">{totals.paidCount} fully paid · {totals.partialCount} partial</p>
            </div>
          </div>
        </div>
        <div className="card p-5 border-l-4 border-red-400">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-100 rounded-xl"><AlertCircle size={20} className="text-red-500" /></div>
            <div>
              <p className="text-sm text-slate-500">Total Pending</p>
              <p className="text-xl font-bold text-slate-800">{formatCurrency(totals.pending)}</p>
              <p className="text-xs text-red-500 mt-0.5">{totals.unpaidCount} unpaid students</p>
            </div>
          </div>
        </div>
        <div className="card p-5 border-l-4 border-indigo-400">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 rounded-xl"><IndianRupee size={20} className="text-indigo-600" /></div>
            <div>
              <p className="text-sm text-slate-500">Total Fee Structure</p>
              <p className="text-xl font-bold text-slate-800">{formatCurrency(totals.total)}</p>
              <p className="text-xs text-indigo-600 mt-0.5">{Math.round((totals.collected / totals.total) * 100)}% collection rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h2 className="card-title flex items-center gap-2"><TrendingUp size={16} />Monthly Fee Collection</h2></div>
        <div className="p-6">
          <BarChartWidget
            data={feeMonthlyData.length > 0 ? feeMonthlyData : [{ month: 'Loading...', target: 0, collected: 0 }]}
            xKey="month"
            bars={[{ key: 'target', name: 'Target (Lakhs)', color: '#e2e8f0' }, { key: 'collected', name: 'Collected (Lakhs)', color: '#6366f1' }]}
          />
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-slate-200 flex flex-wrap gap-3 items-center">
          <SearchInput value={query} onChange={setQuery} placeholder="Search by name, roll number..." className="flex-1 min-w-48" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select w-auto">
            <option value="">All Status</option>
            <option>Paid</option>
            <option>Partial</option>
            <option>Unpaid</option>
          </select>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th><th>Roll No.</th><th>Department</th><th>Semester</th>
                <th>Total Fees</th><th>Paid</th><th>Pending</th><th>Status</th><th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="text-center py-10 text-slate-400">Loading fees...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-10 text-slate-400">No fee records found.</td></tr>
              ) : paginated.map((fee) => (
                <tr key={fee.id}>
                  <td>
                    <div>
                      <p className="font-medium text-slate-800">{fee.studentName}</p>
                      <p className="text-xs text-slate-400">{fee.studentId}</p>
                    </div>
                  </td>
                  <td className="font-mono text-xs text-slate-500">{fee.rollNumber}</td>
                  <td className="text-sm text-slate-600">{fee.departmentName}</td>
                  <td className="text-center text-sm text-slate-600">Sem {fee.semester}</td>
                  <td className="font-medium text-slate-700">{formatCurrency(fee.totalFees)}</td>
                  <td className="text-green-600 font-medium">{formatCurrency(fee.paidAmount)}</td>
                  <td className="text-red-500 font-medium">{formatCurrency(fee.pendingAmount)}</td>
                  <td><span className={getFeeStatusBadge(fee.feeStatus)}>{fee.feeStatus}</span></td>
                  <td className="text-slate-500 text-sm">{fee.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} total={total} pageSize={12} />
      </div>
    </div>
  );
}
