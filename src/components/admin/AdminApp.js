import React from 'react';
import { AuthProvider, ProtectedRoute, LoginForm } from './auth-components';

// Wrap the entire admin application with AuthProvider
const AdminApp = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

// Routes component to handle admin routing
const Routes = () => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Public routes don't require authentication
  const publicRoutes = ['/admin/login'];

  // If the route is public, render it directly
  if (publicRoutes.includes(pathname)) {
    return <LoginForm />;
  }

  // For all other routes, wrap them in ProtectedRoute
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
};

export default AdminApp;