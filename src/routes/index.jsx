import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardPage from '../pages/dashboard/DashboardPage';
import StudentsListPage from '../pages/students/StudentsListPage';
import StudentProfilePage from '../pages/students/StudentProfilePage';
import AddStudentPage from '../pages/students/AddStudentPage';
import TeachersListPage from '../pages/teachers/TeachersListPage';
import TeacherProfilePage from '../pages/teachers/TeacherProfilePage';
import DepartmentsPage from '../pages/departments/DepartmentsPage';
import CoursesPage from '../pages/courses/CoursesPage';
import AttendancePage from '../pages/attendance/AttendancePage';
import ResultsPage from '../pages/results/ResultsPage';
import FeesPage from '../pages/fees/FeesPage';
import DocumentsPage from '../pages/documents/DocumentsPage';
import ReportsPage from '../pages/reports/ReportsPage';
import SettingsPage from '../pages/settings/SettingsPage';
import LoginPage from '../pages/auth/LoginPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'students', element: <StudentsListPage /> },
      { path: 'students/add', element: <AddStudentPage /> },
      { path: 'students/:id', element: <StudentProfilePage /> },
      { path: 'teachers', element: <TeachersListPage /> },
      { path: 'teachers/:id', element: <TeacherProfilePage /> },
      { path: 'departments', element: <DepartmentsPage /> },
      { path: 'courses', element: <CoursesPage /> },
      { path: 'attendance', element: <AttendancePage /> },
      { path: 'results', element: <ResultsPage /> },
      { path: 'fees', element: <FeesPage /> },
      { path: 'documents', element: <DocumentsPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);

export default router;
