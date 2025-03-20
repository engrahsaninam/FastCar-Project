'use client';

import { AuthProvider } from '@/components/admin/auth-components';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { LoginForm } from '@/components/admin/auth-components';
import { useAuth } from '@/components/admin/auth-components';

const AdminPage = () => {
  return (
    <AuthProvider>
      <AdminPageContent />
    </AuthProvider>
  );
};

const AdminPageContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return user ? <AdminDashboard /> : <LoginForm />;
};

export default AdminPage;