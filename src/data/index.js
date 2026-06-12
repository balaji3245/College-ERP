export * from './students';
export * from './teachers';
export * from './courses';
export * from './departments';
export * from './attendance';
export * from './results';
export * from './fees';

export const dashboardStats = {
  totalStudents: 0,
  totalTeachers: 0,
  totalDepartments: 0,
  totalCourses: 0,
  activeClasses: 0,
  todayAttendance: 0,
};

export const recentAdmissions = [];
export const recentActivities = [];
export const attendanceTrend = [];
export const departmentDistribution = [];
export const studentsByDept = [];
export const feeCollectionByMonth = [];
