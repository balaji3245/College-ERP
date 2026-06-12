import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === 'Student' || user?.role === 'Parent') {
    return <StudentDashboard />;
  }
  
  if (user?.role === 'Teacher') {
    return <TeacherDashboard />;
  }

  // Default to Admin Dashboard
  return <AdminDashboard />;
}
