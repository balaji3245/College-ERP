export function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '-';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function formatPercentage(value) {
  return `${value}%`;
}

export function getAttendanceBadge(percentage) {
  if (percentage >= 85) return 'badge-green';
  if (percentage >= 75) return 'badge-yellow';
  return 'badge-red';
}

export function getFeeStatusBadge(status) {
  if (status === 'Paid') return 'badge-green';
  if (status === 'Partial') return 'badge-yellow';
  return 'badge-red';
}

export function getStudentStatusBadge(status) {
  if (status === 'Active') return 'badge-green';
  if (status === 'Inactive') return 'badge-red';
  if (status === 'Alumni') return 'badge-blue';
  return 'badge-gray';
}

export function getGradeBadge(grade) {
  if (['O', 'A+'].includes(grade)) return 'badge-green';
  if (['A', 'B+'].includes(grade)) return 'badge-blue';
  if (['B', 'C'].includes(grade)) return 'badge-yellow';
  return 'badge-red';
}

export function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function calculateAge(dob) {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function truncate(str, length = 30) {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
}

export function getDocumentStatusBadge(status) {
  if (status === 'Uploaded') return 'badge-green';
  if (status === 'Pending') return 'badge-yellow';
  return 'badge-red';
}

export function getSemesterLabel(sem) {
  const ordinals = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
  return `${ordinals[sem - 1] || sem} Semester`;
}

export function getDeptColor(deptId) {
  const colors = {
    D001: 'bg-blue-100 text-blue-700',
    D002: 'bg-indigo-100 text-indigo-700',
    D003: 'bg-yellow-100 text-yellow-700',
    D004: 'bg-orange-100 text-orange-700',
    D005: 'bg-green-100 text-green-700',
    D006: 'bg-purple-100 text-purple-700',
    D007: 'bg-red-100 text-red-700',
    D008: 'bg-teal-100 text-teal-700',
  };
  return colors[deptId] || 'bg-slate-100 text-slate-700';
}
